<template>
  <div id="app">
    <Header v-if="is_admin == false" />
    <AdminSideNav v-if="is_admin == true"></AdminSideNav>
    <AdminHeader v-if="is_admin == true"></AdminHeader>
    <router-view></router-view>
    <Footer v-if="is_admin == false" />
    <div v-if="is_admin == false" class="border-top copyright">
        <p class="m-0 py-3">©Copyright. All rights reserved Vladan Ristić</p>
    </div>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import VueJwtDecode from 'vue-jwt-decode'

export default {
  name: 'App',
  components: {
    VueJwtDecode,
    HelloWorld,
    Header: () => import("./views/Header.vue"),
    Footer: () => import("./views/Footer.vue"),
    AdminSideNav: () => import("./views/admin/AdminSideNav.vue"),
    AdminHeader: () => import("./views/admin/AdminHeader.vue")
  },
  data: function () {
    return {
      is_admin: false
    }
  },
  methods: {
    isAdmin() {
      try {
        
        let token = localStorage.getItem("ac_t");
        
        try {
          token = VueJwtDecode.decode(token)
        } catch(e) {
          console.log(e)
        }
        
        if(token.roles[0] == "super-admin" || token.roles[0] == "admin") {
          this.is_admin = true;
        } else {
          this.is_admin = false;
        }
      } catch (e) {
        this.is_admin = false;
      }
    }
  },
  mounted() {
    if(localStorage.getItem("lang") == undefined) {
      localStorage.setItem("lang", "sr")
    }

    this.isAdmin();

    if(localStorage.getItem("lang") != null && localStorage.getItem("lang") != undefined) {
      this.$i18n.locale = localStorage.getItem("lang");
    }
  }
}
</script>

<style>
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
    }

    :root {
        --gray-dark: #343a40 !important;
        --blue: #5475ed !important;
        --indigo: #6610f2 !important;
        --pink: #e83e8c !important;
        --red: #ed4040 !important;
        --orange: #fb9678 !important;
        --yellow: #fec107 !important;
        --green: #00c292 !important;
        --teal: #20c997 !important;
        --white: #fff !important;
        --gray: #6c757d !important;
        --primary: #ed4040 !important;
        --secondary: #f8f9fa !important;
        --success: #00c292 !important;
        --info: #5475ed !important;
        --warning: #fec107 !important;
        --danger: #ed4040 !important;
        --light: #f8f9fa !important;
        --dark: #343a40 !important;
        --cyan: #01c0c8 !important;
        --purple: #7015bd !important;
    }

    .btn {
        border: 0 !important;
        box-shadow: none !important;
    }

    .btn-info {
        background-color: var(--blue) !important;
    }

    .btn-info:hover {
        background-color: var(--purple) !important;
    }

    .btn-yellow {
        background-color: var(--yellow) !important;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }

    #top-holder + div {
        padding-top: 70px;
    }

    #top-holder {
        z-index: 999;
    }

    body.swal2-toast-shown.swal2-container {
        width: 100%;
        height: 100vh;
    }

    .swal2-container {
        z-index: 9999 !important;
    }

    .router-link-active {
        border-bottom: 1px solid !important;
    }
</style>
