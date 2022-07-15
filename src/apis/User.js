import Api from "./Api";
import Csrf from "./Csrf";

export default {
  async register(form) {
    await Csrf.getCookie();

    return Api.post("/register", form);
  },

  async login(form) {
    await Csrf.getCookie();

    return Api.post("/login", form);
  },

  async logout() {
    await Csrf.getCookie();

    return Api.post("/logout");
  },

  auth() {
    return Api.get("/user");
  },

  obtenerUsuarios() {
    return Api.get("/usuarios");
  },

  registrarUsuario(editedItem) {
    return Api.post("/registerUser", editedItem)
  },

  updateUsuario(editedItem, id) {
    return Api.put("/usuarios/" + id, editedItem)
  },

  desactivarUsuario(id) {
    return Api.put("/usuarios/desactivar/" + id)
  },

  listarSIM() {
    return Api.get("/simcard");
  },

  crearSIM(editedItem) {
    return Api.post("/simcard", editedItem);
  },

  editarSIM(editedItem, id) {
    return Api.put("/simcard/" + id, editedItem);
  },

  desactivarSIM(id) {
    return Api.put("/simcard/desactivar/" + id);
  },

  reporteUsuario(){
    return Api.get("/reporteUsuarios",{responseType: 'blob'});
  },

  reporteSIM(){
    return Api.get("/reporteSIM",{responseType: 'blob'});
  }


};