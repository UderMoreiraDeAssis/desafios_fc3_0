export interface ValidatorInterface<Entity> {
  validate (entity: Entity): void;
}
