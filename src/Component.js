export class Component {
  __owner = null;
  static __type = -1;

  static get type(){
    return this.__type;
  }

  static set type(value){
    this.__type = value;
  }

  get type(){
    return this.constructor.type;
  }

  set type(value){
    this.constructor.type = value;
  }

  get owner(){
    return this.__owner;
  }

  set owner(value){
    this.__owner = value;
  }
}
