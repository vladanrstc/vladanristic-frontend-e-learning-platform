<template>
    <div style="padding-left: 1.7rem; padding-right: 1.7rem">
        <div class="row">
            <div class="col col-12 col-md-4 d-stat">
                <div style="background-color: #01c0c8 !important">
                    <i class="fa fa-users" aria-hidden="true" style="font-size: 170%"></i>
                    <div>
                        <div>
                            {{ this.stats.users }}
                            korisnika
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-12 col-md-4 d-stat">

                <div style="background-color: #ed4040!important">
                    <i class="fa fa-bar-chart" aria-hidden="true" style="font-size: 170%"></i>
                    <div>
                        <div>
                            {{ this.stats.courses }}
                            kursa
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-12 col-md-4 d-stat">
                <div style="background-color: #01c0c8 !important">
                    <i class="fa fa-tasks" aria-hidden="true" style="font-size: 170%"></i>
                    <div>
                        <div>
                            {{ this.stats.sections }}
                            sekcije
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col col-12 col-md-4 d-stat">
                <div style="background-color: #ed4040!important">
                    <i class="fa fa-flask" aria-hidden="true" style="font-size: 170%"></i>
                    <div>
                        <div>
                            {{ this.stats.lessons }}
                            lekcije
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col col-12 col-md-4 d-stat">
                <div style="background-color: #01c0c8 !important">
                    <i class="fa fa-list-ol" aria-hidden="true" style="font-size: 170%"></i>
                    <div>
                        <div>
                            {{ this.stats.tests }}
                            testa
                        </div>
                    </div>
                </div>
            </div>

            <div class="col col-12 col-md-4 d-stat">
                <div style="background-color: #ed4040!important">
                    <i class="fa fa-hourglass-start" aria-hidden="true" style="font-size: 170%"></i>
                    <div>
                        <div>
                            {{ this.stats.courses_started }}
                            započetih kursa
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";

    export default {
        name: "AdminLogin",
        components: {},
        data() {
            return {
                stats: []
            }
        },
        mounted() {

            axios.get("/stats").then(response => {
                console.log(response)
                this.stats = response.data
            }).catch(err => {

            })

        },
        methods: {}
    };
</script>

<style scoped>

    .d-stat {
        padding: 1rem;
    }

    .d-stat > div {
        font-size: 36px;
        color: #fff;
        display: flex;
        align-items: center;
        height: 200px;
        justify-content: space-evenly;
    }

</style>
