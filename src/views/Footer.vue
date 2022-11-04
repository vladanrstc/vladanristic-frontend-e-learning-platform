<template>
    <footer class="py-3 py-lg-5">
        <div class="py-3 py-lg-5">
            <section id="leatest-videos-section" class="px-5 px-md-0">
                <h1 class="m-0">{{ $t("footer.title") }}</h1>
                <div class="px-md-5 py-3 my-3 py-lg-5 my-lg-5">
                    <div class="row px-lg-5 d-flex justify-content-center">
                        <div v-for="video in videos" class="col col-12 col-lg-6 col-xl-4 my-3 pt-0 pt-md-4 pt-lg-4 pt-xl-0 my-md-0 d-flex justify-content-center" >
                            <a target="_blank" :href="'https://youtu.be/' + video.lesson_video" class="text-white">
                                <div class="position-relative img-v-container" style="max-width: 320px">
                                    <div class="bg-f-image">
                                        <i class="fa fa-youtube-play" aria-hidden="true"></i>
                                    </div>
                                    <img :src="'https://i.ytimg.com/vi/' + video.lesson_video + '/mqdefault.jpg'">
                                    <h3 class="video-title">{{ video.lesson_name }}</h3>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <section id="social-media-section" class="">
                <div class="container">
                    <div class="row social-media-row">
                        <div class="col col-12 col-md-4 text-lg-right">
                            <h3 class="float-right text-center">Facebook<br><i class="fa fa-facebook-official"
                                                                               aria-hidden="true"></i></h3>
                        </div>
                        <div class="col col-12 col-md-4 text-center">
                            <h3>YouTube<br><i class="fa fa-youtube" aria-hidden="true"></i></h3>
                        </div>
                        <div class="col col-12 col-md-4 text-lg-left">
                            <h3 class="float-left text-center">Linkedin<br><i class="fa fa-linkedin-square"
                                                                              aria-hidden="true"></i></h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </footer>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "Footer",
        components: {},
        mounted() {
            this.lang = this.$root.$i18n.locale
            this.getVideos();

        },
        data() {
            return {
                videos: [],
                lang: "sr"
            }
        },
        methods: {
            getVideos() {

                let primary_lang = this.lang;

                let secondary_lang = "";
                if(primary_lang == "sr") {
                    secondary_lang = "en";
                } else {
                    secondary_lang = "sr";
                }

                

                axios.get("/stats/last-three-videos").then(response => {
                    response.data.data.forEach((value, index) => {

                        let lang_to_use = "";
                        if(value.lesson_video_link[primary_lang] != undefined && value.lesson_video_link[primary_lang] != null) {
                            lang_to_use = primary_lang;
                        } else {
                            lang_to_use = secondary_lang;
                        }

                        let obj = {
                            "lesson_name": value.lesson_title[lang_to_use],
                            "lesson_video": value.lesson_video_link[lang_to_use],
                        }
                        this.videos.push(obj)                        
                    });
                    console.log(this.videos)
                }).catch(error => {
                    console.log(error)
                })
            }
        }
    };
</script>

<style scoped>
    footer {
        color: #ffffff;
        background-color: #2a3e57;
    }

    @media (max-width: 768px) {

        #social-media-section > div {
            min-width: 100%;
            margin-left: 0px;
            margin-right: 0px;
        }

    }

    @media (max-width: 766px) {

        .social-media-row > div {
            display: flex;
            justify-content: center;
            margin-bottom: 1rem;
            margin-top: 1rem;
        }

    }

    .video-title {
        position: absolute;
        top: 5px;
        left: 5px;
    }

    .bg-f-image {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #00000073;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .img-v-container {
        transition: all .2s ease-in-out;
    }

    .img-v-container:hover {
        transform: scale(1.1);
        cursor: pointer;
    }

    .bg-f-image > i {
        font-size: 4rem;
    }

</style>
