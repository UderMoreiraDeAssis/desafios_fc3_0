package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com.br/devfullcycle/fc-ms-balances/internal/database"
	"github.com.br/devfullcycle/fc-ms-balances/internal/usecase/create_balance"
	"github.com.br/devfullcycle/fc-ms-balances/internal/usecase/find_account"
	"github.com.br/devfullcycle/fc-ms-balances/internal/web"
	"github.com.br/devfullcycle/fc-ms-balances/internal/web/webserver"
	"github.com/confluentinc/confluent-kafka-go/kafka"
	_ "github.com/go-sql-driver/mysql"
)

type BalanceEvent struct {
	Name    string      `json:"Name"`
	Payload BalanceData `json:"Payload"`
}

type BalanceData struct {
	AccountIDFrom      string  `json:"account_id_from"`
	AccountIDTo        string  `json:"account_id_to"`
	BalanceAccountFrom float64 `json:"balance_account_id_from"`
	BalanceAccountTo   float64 `json:"balance_account_id_to"`
}

func ensureTopic(bootstrap, topic string, partitions int) error {
	admin, err := kafka.NewAdminClient(&kafka.ConfigMap{
		"bootstrap.servers": bootstrap,
	})
	if err != nil {
		return fmt.Errorf("admin client: %w", err)
	}
	defer admin.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	specs := []kafka.TopicSpecification{{
		Topic:             topic,
		NumPartitions:     partitions,
		ReplicationFactor: 1,
	}}

	results, err := admin.CreateTopics(ctx, specs)
	if err != nil {
		return fmt.Errorf("create topics request: %w", err)
	}
	for _, r := range results {
		switch r.Error.Code() {
		case kafka.ErrNoError, kafka.ErrTopicAlreadyExists:
		default:
			return fmt.Errorf("create topic %s: %s", r.Topic, r.Error.String())
		}
	}
	return nil
}

func main() {
	db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&parseTime=True&loc=Local", "root", "root", "balances-mysql", "3306", "balances"))
	if err != nil {
		panic(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS balances (id varchar(255), account_id varchar(255), balance integer, created_at timestamp)")
	if err != nil {
		panic(err)
	}

	_, _ = db.Exec("INSERT INTO balances (id, account_id, balance, created_at) VALUES " +
		"('1e46cf48-1007-43b0-801e-8b0015003bca', '292bd47e-95b1-46aa-9145-59855153c866', 850, '2024-01-27 17:13:48'), " +
		"('69472213-d078-4172-97b8-cf6e2d5b24c6', '796016e9-2e0e-416d-9416-dcd1815778e9', 1150, '2024-01-27 17:13:48'), " +
		"('a1398bfc-9bc0-487c-b7dd-a250438e6d04', '292bd47e-95b1-46aa-9145-59855153c866', 800, '2024-01-27 17:13:55'), " +
		"('38063402-2fbe-4ca7-9fcf-53ab59adb9dd', '796016e9-2e0e-416d-9416-dcd1815778e9', 1200, '2024-01-27 17:13:55')")

	balanceDb := database.NewBalanceDB(db)

	createBalanceUseCase := create_balance.NewCreateBalanceUseCase(balanceDb)
	findAccountUseCase := find_account.NewFindAccountUseCase(balanceDb)

	go func() {
		ws := webserver.NewWebServer(":3003")
		accountHandler := web.NewWebBalanceHandler(*findAccountUseCase)
		ws.AddHandler("/accounts/{account_id}", accountHandler.FindAccount)
		fmt.Println("Server running at port 3003")
		ws.Start()
	}()

	configMap := &kafka.ConfigMap{
		"bootstrap.servers":  "kafka:29092",
		"client.id":          "balances",
		"group.id":           "balances",
		"auto.offset.reset":  "earliest",
		"enable.auto.commit": false,
	}
	c, err := kafka.NewConsumer(configMap)
	if err != nil {
		fmt.Println("error consumer:", err.Error())
		return
	}
	defer c.Close()

	if err := ensureTopic("kafka:29092", "balances", 1); err != nil {
		fmt.Println("erro ao garantir topico:", err)
		return
	}

	if err := c.SubscribeTopics([]string{"balances"}, nil); err != nil {
		fmt.Println("subscribe error:", err)
		return
	}

	for {
		msg, err := c.ReadMessage(-1)
		if err != nil {
			if kerr, ok := err.(kafka.Error); ok && kerr.IsFatal() {
				fmt.Println("erro fatal no consumidor:", kerr)
				break
			}
			fmt.Println("erro ao ler mensagem:", err)
			continue
		}

		var event BalanceEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			fmt.Println("erro JSON:", err)
			if _, e2 := c.CommitMessage(msg); e2 != nil {
				fmt.Println("erro ao commitar (apos erro JSON):", e2)
			}
			continue
		}

		in := create_balance.CreateBalanceInputDTO{
			AccountID: event.Payload.AccountIDFrom,
			Balance:   event.Payload.BalanceAccountFrom,
		}
		if _, err := createBalanceUseCase.Execute(in); err != nil {
			fmt.Println("erro ao persistir balance from:", err)
		}

		in = create_balance.CreateBalanceInputDTO{
			AccountID: event.Payload.AccountIDTo,
			Balance:   event.Payload.BalanceAccountTo,
		}
		if _, err := createBalanceUseCase.Execute(in); err != nil {
			fmt.Println("erro ao persistir balance to:", err)
		}

		if _, err := c.CommitMessage(msg); err != nil {
			fmt.Println("erro ao commitar:", err)
		}
	}
}
