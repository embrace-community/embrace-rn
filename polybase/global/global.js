@public
collection Profile {
  id: string;
  publicKey: PublicKey;
  handle: string;
  displayName: string;
  metadataUri?: string;
  avatarUri?: string;



  // `constructor` is called when a new record is
  // created, make sure to assign a value to `this.id`
  constructor (id: string, handle: string) {
    // `this.id` must be assigned in the constructor
    // `this.id` must be unique in collection
    this.id = id;

    this.handle = handle;
    
    
    // You can assign the publicKey of the user who is
    // creating the record, this can then be used to
    // control permissions for the record (see below)
    this.publicKey = ctx.publicKey;
  }

  // You can add your own functions to determine rules
  // on who can update the records data
  function setName (name: string) {
    // Check if the caller is the original creator of the record.
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.name = name;
  }

  // You can add your own functions to determine rules
  // on who can update the records data
  function setUser (name: string, age?: number) {
    // Check if the caller is the original creator of the record.
    if (ctx.publicKey != this.publicKey) {
      error('You are not the creator of this record.');
    }
    this.name = name;
    this.age = age;
  }
}