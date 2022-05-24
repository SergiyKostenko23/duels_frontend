<template>
    <div>
        <h1 style="margin: 5px;">{{this.duels[0].nome}}</h1>
        <h5 style="display: inline; float: left; margin: 6px;">Número de itens: {{getItemsNum()}}</h5>
        <a @click="deleteDuel()" style="display: inline; float: right; margin: 6px; cursor: pointer;">Eliminar</a>
    <div id="table-scroll" class="table-scroll">
        <table id="main-table" class="main-table">
            <thead>
                <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Popularidade</th>
                    <th>Editar</th>
                </tr>
            </thead>
            <tbody v-for="(item, index) in items" v-bind:key="item.id">
                <tr v-if="editing===item.id">
                    <td><input type="text" id="input1" v-model="item.url" :placeholder="item.url"></td>
                    <td><input type="text" id="input2" v-model="item.nome" :placeholder=item.nome></td>
                    <td>{{item.popularidade}}</td>
                    <td><button class="muted-button" @click="editItems(item)">Confirmar</button><button class="muted-button" @click="editing = null">Cancelar</button></td>
                </tr>
                <tr v-else>
                    <td v-if="checkVid(item.url)"><img v-bind:src="item.url" width="100%" max-height="100%"></td>
                    <td v-else><div class="videoWrapper"><iframe :src="item.url"></iframe></div></td>
                    <td>{{item.nome}}</td>
                    <td>{{item.popularidade}}</td>
                    <td><button class="muted-button" @click="setEditing(item.id)" style="margin: 2px;">Editar</button><button class="muted-button" @click="deleteItems(item.id, index)" style="margin: 2px;">Eliminar</button></td>
                </tr>
            </tbody>
            <tfoot style="position: sticky;">
                <td><input type="text" class="input-white" v-model="inputItem.url" placeholder="https://i.imgur.com/PDXE4zW.mp4"></td>
                <td><input type="text" class="input-white" v-model="inputItem.nome" placeholder="Novo Item"></td>
                <td>-</td>
                <td><button class="muted-button-add" @click="addItems()">Adicionar</button></td>
            </tfoot> 
        </table>
    </div>
    </div>
</template>

<script>
export default {
    props: ['slug'],
    name: "items",
    data() {
        return {
            duels: [{'nome': null}],
            items: [],
            editing: null,
            inputItem: {
                url: null,
                nome: null
            },
            titulo: null,
        }
    },
    methods: {
        setEditing(id) {
            this.editing = id
        },
        getDuels() {
            const config = {
                method: 'get',
                url: '/api/duel?slug='+this.slug,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
                }
            }
            this.axios(config).then(response => {
                this.duels = response.data
                this.titulo = this.duels[0].nome
            }).then(() => {
                this.getItems()
            }).catch(error => {
                console.log(error)
            })
        },
        getItems() {
            const config = {
                method: 'get',
                url: '/api/item?duel='+this.duels[0].id,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
                }
            }
            this.axios(config).then(response => {
                this.items = response.data
            }).catch(error => {
                console.log(error)
            })
        },
        editItems(input) {
            this.editing=null
            const config = {
                method: 'put',
                url: '/api/item',
                data: {
                    id: input.id,
                    url: input.url,
                    nome: input.nome
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).catch(error => {
                console.log(error)
            })
        },
        deleteItems(input, idx) {
            const config = {
                method: 'delete',
                url: '/api/item',
                data: {
                    id: input,
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).then(response => {
                this.items.splice(idx, 1)
            }).catch(error => {
                console.log(error)
            })
        },
        addItems() {
            const config = {
                method: 'post',
                url: '/api/item',
                data: {
                    url: this.inputItem.url,
                    nome: this.inputItem.nome,
                    duel: this.duels[0].id
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).then(response => {
                this.items.push(response.data)
                this.inputItem.url=null
                this.inputItem.nome=null
            }).catch(error => {
                console.log(error)
            })
        },
        getItemsNum() {
            const self = this
            var count =0
            for(var i in self.items)
                count++
            return count
        },
        deleteDuel() {
            const config = {
                method: 'delete',
                url: '/api/duel',
                data: {
                    id: this.duels[0].id,
                },
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token')
                }
            }
            this.axios(config).then(() => {
                this.$router.push({name: 'myduels'})
            }).catch(error => {
                console.log(error)
            })
        },
        checkVid(url) {
            return !url.includes("youtu")
        }
    },
  mounted() {
    this.getDuels()
  }
    
}
</script>

<style scoped>
.input-white {
    background: #fff;
    border-color: #fff;
    color: #000
}
.muted-button-add {
    background: #fff;
    border-color: #fff;
    color: #000
}
.table-scroll {
  position: relative;
  width:100%;
  z-index: 1;
  margin: auto;
  height: calc(100vh - 137px);
  overflow: auto;
}
.table-scroll table {
  width: 100%;
  margin: auto;
  border-collapse: separate;
  border-spacing: 0;
}
.table-wrap {
  position: relative;
}
.table-scroll th,
.table-scroll td {
  padding: 5px 10px;
  border: 1px solid #000;
  background: #fff;
  text-align: center;
}
.table-scroll thead th {
  background: #333;
  color: #fff;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}
/* safari and ios need the tfoot itself to be position:sticky also */
.table-scroll tfoot,
.table-scroll tfoot th,
.table-scroll tfoot td {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  color: #fff;
  background: #333;
  z-index:4;
}

a:focus {
  background: red;
} /* testing links*/

th:first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
  background: #ccc;
}
thead th:first-child,
tfoot th:first-child {
  z-index: 5;
}
td {
    max-width: 100px;
}

@media (max-width: 600px) {
    .table-scroll {
        height: calc(100vh - 122px);
    }
}
.videoWrapper {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
}
.videoWrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>