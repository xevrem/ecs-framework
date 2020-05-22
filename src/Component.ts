export class Component {
  owner: number = -1;

  static type: number = -1;
  get type() {
    let inst = this.constructor as typeof Component;
    return inst.type;
  }
  set type(value: number) {
    let inst = this.constructor as typeof Component;
    inst.type = value;
  }
}
