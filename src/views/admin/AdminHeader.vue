<template>
    <b-navbar toggleable="lg" type="dark" class="mb-3">
        <b-navbar-brand href="#">vladanristic.com</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-button id="toggle-sidenav" v-b-toggle.sidebar-backdrop>
                <i class="fa fa-bars" id="bars" aria-hidden="true"></i>
            </b-button>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
            <b-nav-item>
                <edit-profile></edit-profile>
            </b-nav-item>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
import EditProfile from "../../components/EditProfile.vue";
import { bus } from '../../main.js'

export default {
  name: "AdminHeader",
  components: {
      EditProfile
  },
};
</script>

<style scoped>

    .navbar-dark {
        background-color: var(--red);
    }

    #toggle-sidenav, #toggle-sidenav:focus {
        background-color: transparent;
        border: 0;
        outline: none;
        box-shadow: none;
    }

    #bars {
        color: #ffffff82 !important;
        font-size: 140%;
        margin-top: 4px;
    }

    #bars:hover {
        color: #fff !important;
    }

</style>
