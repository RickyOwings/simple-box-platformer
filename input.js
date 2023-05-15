export default class Input {
  constructor(...keys) {
    this.keys = [...keys];
    this.states = new Array(this.keys.length).fill(false);
    document.addEventListener("keydown", (ev) => {
      this.keydown(ev);
    });
    document.addEventListener("keyup", (ev) => {
      this.keyup(ev);
    });
  }
  keyup(ev) {
    if (!this.keys.includes(ev.key))
      return;
    let index = this.keys.indexOf(ev.key);
    this.states[index] = false;
  }
  keydown(ev) {
    if (!this.keys.includes(ev.key))
      return;
    let index = this.keys.indexOf(ev.key);
    this.states[index] = true;
  }
  pressed(key) {
    if (!this.keys.includes(key))
      return false;
    let index = this.keys.indexOf(key);
    return this.states[index];
  }
}
