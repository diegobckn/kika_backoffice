class Singleton {
    static instances:any = {};
  
      static getInstance() {
          if (Singleton.instances[this.name] === undefined) {
              Singleton.instances[this.name] = new this();
          }
          return Singleton.instances[this.name];
      }
  }

  export default Singleton;