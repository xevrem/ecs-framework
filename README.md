# ecs-framework
===============

an ECS framework for JavaScript/TypeScript


## create an instance:

```typescript
const ecs = new EcsInstance();
```

## define and register components;

```typescript
class Foo extends Component {
  myDataProp!: number;
}

ecs.registerComponent(Foo);
```

## define an entity with components

```typescript
const foo = new Foo();
foo.myDataProp = 42;

/*
 * note all entities defined this way are "Results"
 * and should be checked for validity just in-case
 * something bad happened during creation. This is
 * only really necissary if you need the entity id
 * right after it is created. NOTE: you don't have
 * to check the entity, but if you wanted to make
 * use of its `id` after creation, you would need
 * to validate it is OK first.
 */
const entity = ecs
  .create()
  .add(foo)
  .tag('my favorite')
  .group('has foo')
  .build();

if(is_ok(entity)){
 // ok, entity is good
} else {
 // oh no, your entity creation failed.
}

```

## define a system that works on entities with a given component

```typescript
type Needed = [typeof Foo];
type Optional = [typeof Bar];

class FooSystem extends EntitySystem<any, Needed, Optional> {
  needed = [Foo];
  optional = [Bar];
  process(entity: Entity, query: Query<Needed, Optional>) {
    /*
     * `query.retrieve` returns a tuple of needed components
     * followed by optional components in the order they are
     * defined i.e., [Foo, Bar]
     */ 
    const [foo, maybeBar] = query.retrieve();
    
    // since foo is needed, and a system -only- processes enties that have needed components
    // foo will always be defined
    foo.myDataProp += 1;
    
    // since bar is optional, it may or may not belong to this entity, so you need to check
    if(is_some(maybeBar)) {
      // bar is defined, so its safe to work on it
    } else {
      // there was no bar on this entity, so it is not safe
    }
  }
}

```

## alterate way to define the same system as a functional System:

```typescript
/*
 * for now, functional systems are `needed` components only. 
 * this will support `optional` and `unwanted` components later.
 */
ecs.withSystem([[NeededComponent], [OptionalComponent], [UnwantedComponent]], ({query}) => {
  // components are returned in order of definition.
  // optional components come after needed components
  // obviously, unwanted components are never returned
  for (const [[foo, bar], entity] of query.join()) {
    // foo is defined, is of type `NeededComponent`, so we can work on it
    foo.myDataProp += 22;
    
    // since bar is optional (i.e., of type `Option<OptionalComponent>`), 
    // we need to test for it    
    if(is_some(bar)){
      // bar exists and is of type `OptionalComponent` on this entity
    }else {
      // bar does not exist on this entity
    }
  }
});
```

## register a class system

```typescript
ecs.registerSystem(FooSystem, {
  // false - not reactive, acts every frame; 
  // true - reactive, only acts when component data update occurs
  reactive: false 
  // order in which this system should run (i.e., first to last)
  // no number defaults to priority of 0
  priority: 1,
  /*
   * you can also add your own props to pass to a system here
   */
});

/*
 * for reactive systems you need to explitly state they are updated
 * in the future we will see if an Observable method is doable without
 * too much of a performance penalty
 */

// for example, lets say `component` is of type `Foo`
ecs.update(component); 
// now all reactive systems that have `Foo` as `needed` or `optional`
// will be run on the next update cycle.
```

## how the ecs instance fits into the `game loop`

```typescript
// 1) create your instance

const ecs = new EcsInstance();

// 2a) register your components individually:
ecs.registerComponent(YourComponent);

// 2b) or register them all at once via import:
import AllComponents from 'path/to/all/components';
ecs.registerComponents(AllComponents);

// NOTE: you must register components before you register systems

// 3) register and initialize your systems
ecs.registerSystem(MovementSystem, { priority: 3 });
ecs.initializeSystems();

// 4) create any -initial- entities you want
ecs.create()
  .addWith((builder)=> {
    const position = new Position();
    position.x = 4;
    position.y = 2;
    return position;
  })
  .add(new Visible())
  .tag('oh hai')
  .build();

// 5) perform initial entity resolution
ecs.initialResolve();

// 6) load your systems
ecs.loadSystems();

// 7) handle any intial entity creations from systems
ecs.initialCreate();

// 8) schedule your systems
ecs.scheduleSystems();

// 9) in your update loop, update the time, resolve changes, and run systems
ecs.updateTime(time);
ecs.resolveEntities(); // creates, updates, destroys appropriate entities and notifies systems
ecs.runSystems(); // runs all non-reactive systems and only the reactive systems that have updates

```
