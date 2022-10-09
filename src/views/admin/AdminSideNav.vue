<template>
    <aside id="admin-sidebar">
        <div id="sidebar-top">            
            <h5 class="m-0 py-3">
                <b-navbar-brand class="p-0 text-white" href="#">
                    <strong>vladanristic.com</strong>
                </b-navbar-brand>
            </h5>
        </div>
        <b-list-group>
            <b-list-group-item>
                <router-link class="admin-link" to="/admin" exact>
                    <i class="fa fa-home" aria-hidden="true"></i>
                    Početna
                </router-link>
            </b-list-group-item>
            <b-list-group-item v-if="this.is_super_admin">
                <router-link class="admin-link" to="/admin/users">
                    <i class="fa fa-users" aria-hidden="true"></i>
                    Korisnici
                </router-link>
            </b-list-group-item>
            <b-list-group-item>
                <router-link class="admin-link" to="/admin/courses">
                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                    Kursevi
                </router-link>
            </b-list-group-item>
            <b-list-group-item id="admin-user-profile" @click="logout">
                <div class="admin-link">
                    <i class="fa fa-sign-out" aria-hidden="true"></i>  
                    Odjavi se
                </div>
            </b-list-group-item>
        </b-list-group>
    </aside>
</template>

<script>
    import { bus } from "../../main.js";

    export default {
        name: "AdminSideNav",
        data() {
            return {
                is_super_admin: false
            }
        },
        mounted() {
            let a = JSON.parse(atob(localStorage.getItem("ac_t").split('.')[1]));
            if(a.scopes[0] == "super-admin") {
                this.is_super_admin = true;
            }
        },
        methods: {
            logout() {
                localStorage.removeItem("ac_t");
                this.$router.push('/');
                bus.$emit('userLoggedStatusChanged');
            }
        }
    };
</script>

<style scoped>

    #admin-sidebar {
        min-height: 100vh;
        position: relative;
        background-color: #272e38;
    }

    #admin-user-profile {
        position: absolute;
        bottom: 0px;
        display: flex;
        justify-content: center;
        text-align: center;
        min-width: 100%;
    }

    #admin-user-profile:hover, #admin-user-profile:hover > * {
        color: #fff;
        cursor: pointer;
    }

    .admin-link {
        font-size: 120%;
        color: #9faec1;
    }

    .nav-item {
        text-align: center;
        display: flex;
        justify-content: center;
        padding-bottom: 20px;
    }

    .list-group-item {
        border-right: 0px;
        border-radius: 0px;
        background-color: #272e38;
        color: #fff;
        border: unset;

    }

    a {
        text-decoration: none !important;
        color: var(--gray);
        font-size: 120%;
    }

    .router-link-exact-active, a:hover {
        color: var(--white);
    }

    .b-sidebar {
        width: 240px !important;
    }

    #sidebar-backdrop___title__, .close {
        color: #fff !important;
    }

    .fa {
        margin-right: 15px;
    }

    #sidebar-top {
        background-color: #232e3e;
    }

</style>
