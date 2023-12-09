import { Entity } from './Entity';

describe('Entity', () => {
  it('should instantiate without crashing', () => {
    const entity = new Entity();
    expect(entity).toBeDefined();
  });
});
