import express, { Request, Response } from 'express';
import { CreateCustomerUseCase, FindCustomerUseCase, ListCustomerUseCase } from '../../../usecase';
import { CustomerRepository } from '../../customer';
import { CustomerPresenter } from '../presenters';

export const customersRoute = express.Router();

customersRoute.post('/', async (req: Request, res: Response) => {
  const usecase = new CreateCustomerUseCase(new CustomerRepository());

  try {
    const customerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        number: req.body.address.number,
        city: req.body.address.city,
        state: req.body.address.state,
        zipCode: req.body.address.zipCode,
      }
    };

    const output = await usecase.execute(customerDto);
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

customersRoute.get('/', async (req: Request, res: Response) => {
  const usecase = new ListCustomerUseCase(new CustomerRepository());

  try {
    const output = await usecase.execute({});
    res.format({
      json: () => res.status(200).json(output),
      xml: () => res.status(200).send(CustomerPresenter.toXML(output)),
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

customersRoute.get('/:id', async (req: Request, res: Response) => {
  const usecase = new FindCustomerUseCase(new CustomerRepository());

  try {
    const output = await usecase.execute({ id: req.params.id });
    res.status(200).json(output);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});
