export class Component {
  owner: number = -1;

  static type: number = -1;
  get type() {
    let inst = <typeof Component>this.constructor;
    return inst.type;
  }
  set type(value: number) {
    let inst = <typeof Component>this.constructor;
    inst.type = value;
  }
}
