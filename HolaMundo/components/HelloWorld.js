Vue.component('hello-world',{
    template:
      `<header>
        <h1> {{title}} </h1>
        <h1> {{message}} </h1>
      </header>`,
    data () {
        return {
            title: "Hola mundo",
            message: "Bienvenidos al mundo de Vuejs"
        }
    }
})