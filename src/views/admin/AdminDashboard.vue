<template>
    <div>
        <div class="row">
            <div class="col col-12 col-md-4 d-stat">
                <div class="bg-white d-stat-holder">
                    <div class="stat-card-header">Broj korisnika</div>
                    <div class="stat-text">
                        {{ this.stats.users }}                        
                    </div>
                    <div class="p-3 stat-icon-holder rounded">
                        <i class="fa fa-users stat-text icon-color" aria-hidden="true"></i>
                    </div>
                </div>
            </div>
            <div class="col col-12 col-md-4 d-stat">
                <div class="bg-white d-stat-holder">
                    <div class="stat-card-header">Broj kursa</div>
                    <div class="stat-text">
                        {{ this.stats.courses }}                                                                     
                    </div>
                    <div class="p-3 stat-icon-holder rounded">
                        <i class="fa fa-bar-chart stat-text icon-color" aria-hidden="true"></i>                                                
                    </div>
                </div>
            </div>
             <div class="col col-12 col-md-4 d-stat">
                <div class="bg-white d-stat-holder">
                    <div class="stat-card-header">Broj sekcija</div>
                    <div class="stat-text">
                        {{ this.stats.sections }}                                                                                                                  
                    </div>
                    <div class="p-3 stat-icon-holder rounded">
                        <i class="fa fa-tasks stat-text icon-color" aria-hidden="true"></i>                                          
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3">
            <div class="col col-12 col-md-4 d-stat">
                <div class="bg-white d-stat-holder">
                    <div class="stat-card-header">Broj lekcija</div>
                    <div class="stat-text">
                        {{ this.stats.lessons }}
                    </div>
                    <div class="p-3 stat-icon-holder rounded">
                        <i class="fa fa-flask stat-text icon-color" aria-hidden="true"></i>                                                             
                    </div>
                </div>
            </div>
            <div class="col col-12 col-md-4 d-stat">
                <div class="bg-white d-stat-holder">
                    <div class="stat-card-header">Broj testa</div>
                    <div class="stat-text">
                        {{ this.stats.tests }}                        
                    </div>
                    <div class="p-3 stat-icon-holder rounded">
                        <i class="fa fa-list-ol stat-text icon-color" aria-hidden="true"></i>                        
                    </div>
                </div>
            </div>
            <div class="col col-12 col-md-4 d-stat">
                <div class="bg-white d-stat-holder">
                    <div class="stat-card-header">Broj započetih kurseva</div>
                    <div class="stat-text">
                        {{ this.stats.courses_started }}                    
                    </div>
                    <div class="p-3 stat-icon-holder rounded">
                        <i class="fa fa-hourglass-start stat-text icon-color" aria-hidden="true"></i>                    
                    </div>
                </div>
            </div>
        </div>
        <div class="row mt-3 px-3">
            <div class="col col-12 bg-white">
                <apexchart class="pt-3" ref="logsChart" type="line" height="350" :options="chartOptions" :series="series"></apexchart>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    
    export default {
        name: "AdminLogin",
        components: {
        },
       data: function() {
        return {
            stats: [],
            series: [{
                name: "Logins",
                data: this.stats?.num_of_monthly_logs
            }],
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: 'Broj prijavljivanja po mesecu',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', '#ffffff'], // takes an array which will be repeated on columns
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                }
            },            
        }
        },
        mounted() {

            axios.get("/stats/overall-status").then(response => {
                this.stats = response.data.data

            this.$refs.logsChart.updateSeries([{
                data: this.stats.num_of_monthly_logs,
            }], false, true);

            }).catch(err => {

            })

        },
        methods: {}
    };
</script>

<style scoped>

    .d-stat {
        padding-bottom: 1rem;
        padding-right: 1rem;
        padding-bottom: 1rem;
        position: relative;
    }

    .d-stat > div {
        color: #fff;
        display: flex;
        align-items: center;
        height: 200px;
        justify-content: space-evenly;
    }

    .stat-card-header {
        color: var(--gray);
        background-color: #f6f7f9!important;
        width: 100%;
    }

    .stat-text, .stat-text > * {
        color: var(--gray);
        font-size: 36px;
    }

    .stat-card-header {
        position: absolute;
        top: 0px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-content: center;
        color: #4c78dd;
        font-weight: bold;
        line-height: 40px;
    }

    .d-stat-holder {
        position: relative;
    }

    .icon-color {
        color: #4c78dd!important;
    }

    .stat-icon-holder {
        background-color: #f6f7f9;
    }

</style>
