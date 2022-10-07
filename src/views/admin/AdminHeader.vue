<template>
    <b-navbar toggleable="lg" type="dark" class="mb-3">

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-button id="toggle-sidenav" v-b-toggle.sidebar-backdrop>
                <i class="fa fa-bars" id="bars" aria-hidden="true"></i>
            </b-button>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        
        </b-collapse>
    </b-navbar>
</template>

<script>
import EditProfile from "../../components/EditProfile.vue";

export default {
  name: "AdminHeader",
  components: {
      EditProfile
  },
};
</script>

<style scoped>

    

</style>
