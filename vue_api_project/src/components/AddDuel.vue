<template>
    <div class="small-container" style="margin-top: 20px;">
        <input type="text" v-model="duel.nome" placeholder="Batatas">
        <input type="text" v-model="duel.desc" placeholder="Duel sobre batatas!">
        <button class="btn" @click="addDuel(duel)">Adicionar</button>
    </div>
</template>

<script>
export default {
    name:"addduel",
    data() {
        return {
            duel: [],
            duels: [],
        }
    },
    methods: {
        addDuel(duel) {
            const config = {
                method: 'post',
                url: '/api/duel',
                data: {
                    nome: this.duel.nome,
                    desc: this.duel.desc,
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
                this.axios(config).then(response => {
                this.duel = response.data
            }).then(() => {
                this.$router.replace({name: 'items', params: {slug: this.duel.slug}})
            }).catch(error => {
                console.log(error)
            })
        },
    }
}
</script>

<style scoped>
input {
    background-color: #FFF;
}
</style>