import {Entity} from './Entity';
import {Component} from './Component';
import {ComponentMapper} from './ComponentMapper';
import {EcsInstance} from './EcsInstance';

describe('ComponentMapper', ()=>{
  let ecs: EcsInstance;
  class Foo extends Component { };

  beforeEach(()=>{
    ecs = new EcsInstance();
    ecs.componentManager.registerComponent(Foo);
  });

  it('should be intantiable',()=>{
    new ComponentMapper(Foo, ecs);
  });

  it('should get components', ()=>{
    const cm = new ComponentMapper(Foo, ecs);
    expect(cm.get(new Entity())).toBeUndefined();
  });

  it('should statically get components', ()=> {
    expect(ComponentMapper.get(Foo, new Entity(), ecs)).toBeUndefined();
  });
});
