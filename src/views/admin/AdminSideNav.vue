<template>
    <aside>
        <b-sidebar
            id="sidebar-backdrop"
            title="vladanristic.com"
            backdrop
            shadow
            bg-variant="light"
            text-variant="dark"
        >
            <div class="px-3 py-2">
                <b-list-group>
                    <b-list-group-item>
                        <router-link to="/admin" exact>
                            <i class="fa fa-home" aria-hidden="true"></i>
                            Početna
                        </router-link>
                    </b-list-group-item>
                    <b-list-group-item v-if="this.is_super_admin">
                        <router-link to="/admin/users">
                            <i class="fa fa-users" aria-hidden="true"></i>
                            Korisnici
                        </router-link>
                    </b-list-group-item>
                    <b-list-group-item>
                        <router-link to="/admin/courses">
                            <i class="fa fa-folder-open" aria-hidden="true"></i>
                            Kursevi
                        </router-link>
                    </b-list-group-item>
                </b-list-group>
            </div>
        </b-sidebar>
    </aside>
</template>

<script>
    export default {
        name: "Footer",
        components: {},
        data() {
            return {
                is_super_admin: false
            }
        },
        mounted() {
            let a = JSON.parse(atob(localStorage.getItem("ac_t").split('.')[1]));
            console.log("SESSS")
            console.log(a)
            if(a.scopes[0] == "super-admin") {
                this.is_super_admin = true;
            }
        }
    };
</script>

<style scoped>

    #sidebar-backdrop {
        background-color: #2b2b2b !important;
    }

    a {
        color: var(--gray);
        font-size: 120%;
    }

    .router-link-exact-active, a:hover {
        color: var(--red);
    }

    .list-group-item {
        background-color: transparent;
        border: 0;
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

</style>
