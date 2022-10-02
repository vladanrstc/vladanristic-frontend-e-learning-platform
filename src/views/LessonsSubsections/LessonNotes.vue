<template>
    <div class="py-4 px-3">
        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
        <div class="d-flex justify-content-start mt-4">
            <b-button variant="success" @click="saveNote()">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                {{ $t('lessons.add_note') }}
            </b-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
    mounted() {
        this.getNotes();
    },
    data() {
        return {
            editorData: '',
            editorConfig: {
                // The configuration of the editor.
            },
            editor: ClassicEditor
        }
    },
    methods: {
        saveNote() {
            let current_course = this.$route.params.course;
            let creating = this.$swal.fire({
                toast: true,
                position: "top-end",
                title: this.$t('notifications.wait'),
                onBeforeOpen: () => {
                    this.$swal.showLoading();
                },
            });
            axios.patch("/courses/started/notes", {
                "notes": this.editorData,
                "course": current_course
            })
                .then(response => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "success",
                        title: this.$t("notifications.saved_note"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                })
                .catch(e => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "error",
                        title: this.$t("notifications.general_error"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                });
        },
        getNotes() {
            axios.get("/notes/course/" + this.$route.params.course)
                .then(response => {

                    if (response.data.data.user_course_started_note != null && response.data.data.user_course_started_note != undefined) {
                        this.editorData = response.data.data.user_course_started_note
                    }

                })
                .catch(e => {
                    this.$swal.fire({
                        toast: true,
                        position: "top-end",
                        icon: "error",
                        title: this.$t("notifications.general_error"),
                        showConfirmButton: false,
                        timer: 4500,
                    });
                });
        },
    }

}
</script>

<style scoped>

</style>

