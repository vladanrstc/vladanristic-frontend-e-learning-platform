<template>
  <div id="app">

    <div class="row no-gutters" v-if="is_admin">
      <div class="col col-2">
        <AdminSideNav></AdminSideNav>
      </div>
      <div id="admin-contents" class="col col-10 p-4">
        <router-view></router-view>
      </div>
    </div>

    <div v-if="!is_admin">
      <Header />
      <router-view></router-view>
      <Footer />
      <div class="border-top copyright">
        <p class="m-0 py-3">©Copyright. All rights reserved Vladan Ristić</p>
      </div>
    </div>

  </div>
</template>

<script>
import { bus } from './main.js'

export default {
  name: 'App',
  components: {
    Header: () => import("./views/Header.vue"),
    Footer: () => import("./views/Footer.vue"),
    AdminSideNav: () => import("./views/admin/AdminSideNav.vue")
  },
  data: function () {
    return {
      is_admin: false
    }
  },
  methods: {
    isAdmin() {
      try {
        let a = JSON.parse(atob(localStorage.getItem("ac_t").split('.')[1]));

        if(a.scopes[0] == "super-admin" || a.scopes[0] == "admin") {
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

    bus.$on('userLoggedStatusChanged', (data) => {
      this.isAdmin();
    })

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
        border-bottom: 1px solid;
    }

    .admin-link {
        border-bottom: none !important;
    }

    #admin-contents {
      background: url("./assets/light-fabric.jpg");
    }

</style>
