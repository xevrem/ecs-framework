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

if (is_ok(entity)) {
  // ok, entity is good
} else {
  // oh no, your entity creation failed.
}
```

## define a system that works on entities with a given component

```typescript
type Needed = [typeof Foo, typeof Bar];
type Optional = [typeof Baz];
type Unwanted = [typeof Nope];

class FooSystem extends EntitySystem<any, Needed, Optional, Unwanted> {
  /*
   * `needed`, `optional`, or `unwanted` need to be set manually
   * OR as part of super call in the constructor.
   */
  needed = [Foo, Bar];
  optional = [Baz];
  unwanted = [Nope];
  /*
   * Same as above, but with constructor approach
   */
  constructor(props: EntitySystemArgs<any, Needed, Optional, Unwanted>){
    super({
     ...props,
     needed: [Foo,Bar],
     optional: [Baz],
     unwanted: [Nope],
    });
  }

  /*
   * run every time the system is called and `shouldProcess`
   * returns positively. It will be called against every
   * entity currently registered to this system. The ECS
   * manages this, so no need to worry :)
   */
  process(entity: Entity, query: Query<Needed, Optional>) {
    /*
     * `query.retrieve` returns a tuple of needed components
     * followed by optional components in the order they are
     * defined i.e., `[Foo, Bar, Option<Baz>]`
     */
    const [foo, bar, maybeBaz] = query.retrieve();

    /*
     * since foo is needed, and a system -only- processes enties
     * that have needed components foo will always be defined
     */
    foo.myDataProp += 22;
    bar.data.subData = 'hihi';

    /*
     * since baz is optional, it may or may not belong to this
     * entity, so you need to check
     */
    if(is_some(maybeBaz)) {
      // baz is defined, so its safe to work on it
      baz.value = new Value();
    } else {
      // there was no baz on this entity, so it is not safe
    }
  }

  /*
   * Alternately you have the `join` method of processing in a system
   * `join` is useful for non-reactive systems, where the data needs
   * to be processed frequently, but the entity's component
   * composition is relatively stable i.e., adding/removal of
   * components is infrequent. The order of returned components is the
   * same as the definition order of `Needed` components, followed by
   * the definition order of `Optional` components.
   */
   join([[foo, bar, maybeBaz], entity]: JoinedResult<Needed, Optional>) {
     ...
   }
   
   /*
    * There are also helpful lifecycle methods that are called at various
    * points when entities are added, removed, created, updated, or deleted.
    * as well as system specific methods called during initialization, 
    * loading, reset, and destruction ECS phases.
    */
}
```

## alternate way to define the same system as a functional System:

```typescript
/*
 * Functional systems take up-to 3 component tuples, defining their
 * Needed, Optional, and Unwanted components, in that order
 */
ecs.withSystem(
  [
    [Foo, Bar],
    [Baz],
    [Nope],
  ],
  ({ query }) => {
    /*
     * components are returned in order of definition. Optional components
     * come after needed components obviously, unwanted components are
     * never returned.
     */
    for (const [[foo, bar], entity] of query.join()) {
      /*
       * `foo` and `bar` are defined, and are of type `Foo`, and
       * `Bar` respectively, so we can work on them safely.
       */
      foo.myDataProp += 22;
      bar.data.subData = 'hihi';

      // since `baz` is optional (i.e., of type `Option<Baz>`),
      // we need to test for its existance before we can safely work on it.
      if (is_some(baz)) {
        // `baz` exists and is of type `Baz` on this entity
        baz.value = new Value();
      } else {
        /*
         * `baz` does not exist on this entity, so it would not be safe to work
         * on it in this context i.e., it is seen as `None`.
         */
      }
    }
  },
);

/*
 * There are also several other types of functional systems that run at
 * at different times. They all have the same arguments as `withSystem`.
 */

/*
 * runs whenever an entity has a component added to it, and will only call
 * your callback when there is a match.
 */
ecs.withAddSystem;

/*
 * runs whenever an entity is created, and will only call your callback
 * when there is a match.
 */
ecs.withCreateSystem;

/*
 * runs whenever an entity is deleted, and will only call your callback
 * when there is a match.
 */
ecs.withDeleteSystem;

/*
 * runs whenever an entity has an update, and will only call your callback
 * when there is a match.
 */
ecs.withUpdateSystem;
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
 * For reactive systems to be notified, you need to explitly state
 * that your component is updated when you alter its data.
 * OR When adding components to an entity, you can explicitly set
 * the `auto` parameter to `true` which will wrap the component in
 * a special observing Proxy that should detect any changes you make.
 * NOTE: for components with complex data structures, it is probably
 * better to use the explicit `ecs.update(component)` approach.
 */

// for example, lets say `component` is of type `Foo`
ecs.update(component);
/*
 * now all reactive systems that have `Foo` as `needed` or `optional`
 * will be run on the next update cycle.
 */

/*
 * for the new auto-updates when adding the `Foo` `component` to the
 * entity, set the `auto` parameter to `true`
 */
const foo = new Foo();
ecs.addComponent(myEntity, foo, true);
// OR
ecs.create().add(new Foo(), true).build();
/*
 * now, when you alter `myDataProp` on `Foo`, all reactive systems
 * that have `Foo` as `needed` or `optional` will be run on the next
 * update cycle.
 */


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
ecs
  .create()
  .addWith(builder => {
    const position = new Position();
    position.x = 4;
    position.y = 2;
    return position;
  })
  // make this visisble component auto-update
  .add(new Visible(), true)
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
