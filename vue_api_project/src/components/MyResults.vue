<template>
    <div>
        <h1>Resultados</h1>
        <div class="select">
            <h5>Número de ítens: </h5>
            <select v-model="limit" style="background-color: #FFF;">
                <option :value=10>10</option>
                <option :value=25>25</option>
                <option :value=50>50</option>
            </select>
        </div>
        <div v-if="hasResults()">
            Por agora não existem resultados...
        </div>
        <div v-else>
        <table class="striped-table">
            <thead>
                <tr>
                    <th class="clickableHeader" @click="getFilter('duels')" v-html="'Duel' + var1"></th>
                    <th class="clickableHeader" @click="getFilter('tempo')" v-html="'Tempo' + var2"></th>
                    <th class="clickableHeader" @click="getFilter('fim')" v-html="'Feito em' + var3"></th>
                </tr>
            </thead>
            <tbody v-for="result in results.data" v-bind:key="result.id">
                <tr class="expand" @click="showResult(result.id)">
                    <td>{{result.duels}}</td>
                    <td>{{getTime(result)}}</td>
                    <td>{{getFeito(result.fim)}}</td>
                </tr>
                <td colspan="4" v-if="show == result.id">
                    <table>
                        <thead>
                            <tr>
                                <th>Lugar</th>
                                <th>Imagem</th>
                                <th>Nome</th>
                                <th>Popularidade</th>
                            </tr>
                        </thead>
                        <tbody v-for="(res, index) in result.result" v-bind:key="res.id">
                            <tr>
                                <td>{{index+1}}º</td>
                                <td><img class="imagem" v-bind:src="res.url" width="100%" max-height="100%"></td>
                                <td>{{res.nome}}</td>
                                <td>{{res.popularidade}}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tbody>
        </table>
        <paginate
            v-model="page"
            :pageCount="getPageCount()"
            :clickHandler="changePage(page)"
            :prevText="'<'"
            :nextText="'>'"
            :containerClass="'pagination'"
            :page-class="'page-item'"
            :next-class="'page-item'"
            :prev-class="'page-item'">
        </paginate>
        </div>
    </div>
</template>

<script>
import Vue2Filters from 'vue2-filters'
export default {
    name:'results',
    mixins: [Vue2Filters.mixin],
    data() {
        return {
            results: [],
            duels: [],
            items: [],
            show: 0,
            page: 1,
            offset: 0,
            limit: 10,
            filtro: 'fim',
            ascdesc: true,
            filterItem: 0,
            var1: "",
            var2: "",
            var3: "",
        }
    },
    methods: {
        getResults() {
            const config = {
                method: 'get',
                url: '/api/result?limit='+this.limit+'&offset='+this.offset+'&ascdesc='+this.ascdesc+'&filter='+this.filterItem,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                    'Authorization': 'token ' + window.localStorage.getItem('token'),
                }
            }
            this.axios(config).then(response => {
                this.results = response.data
            }).catch((error) => {
                console.log(error)
            })
        },
        getTime(res) {
            var date1 = new Date(res.fim)
            var date2 = new Date(res.inicio)
            var tempo = Math.abs((date1-date2)/1000)
            var h = Math.floor(tempo / 3600);
            var m = Math.floor(tempo % 3600 / 60)
            var s = Math.floor(tempo % 3600 % 60)
            var hDisplay = h > 0 ? h + (h == 1 ? " hora, " : " horas, ") : ""
            var mDisplay = m > 0 ? m + (m == 1 ? " minuto, " : " minutos, ") : ""
            var sDisplay = s > 0 ? s + (s == 1 ? " segundo" : " segundos") : ""
            res.tempo = tempo
            return hDisplay + mDisplay + sDisplay
        },
        hasResults() {
            if((this.results.data==undefined))
                return true
            else
                return false
        },
        getFeito(res) {
            var d = new Date(res)
            let dia = d.getDate()
            let mes = d.getMonth()+1
            let ano = d.getFullYear()
            let horas = d.getHours()
            return (dia+"/"+mes+"/"+ano+", "+horas+"h")
        },
        showResult(r) {
            if((this.show!=0)&&(this.show==r))
                return this.show = 0
            else
                return this.show = r
        },
        changePage(pageNum) {
            this.offset = (pageNum-1)*this.limit
        },
        getPageCount() {
            return Math.ceil(this.results.total/this.limit)
        },
        getFilter(filter) {
            switch(filter) {
                case 'duels': this.filtro = 'duels'; this.ascdesc = !this.ascdesc; this.filterItem = 1; this.setFilter(); break
                case 'tempo': this.filtro = 'tempo'; this.ascdesc = !this.ascdesc; this.filterItem = 2; this.setFilter(); break
                case 'fim': this.filtro = 'fim'; this.ascdesc = !this.ascdesc; this.filterItem = 3; this.setFilter(); break
            }
        },
        getAscDesc(val) {
            if(val === true)
                return 1
            else
                return -1
        },
        setFilter(f) {
            switch(f) {
                case 0: break
                case 1: if(this.ascdesc === true){ this.var1 = "&#9652;"; this.var2 = "", this.var3 = "" } else{ this.var1 = "&#9662;"; this.var2 = "", this.var3 = "" } this.getResults(); break
                case 2: if(this.ascdesc === true){ this.var2 = "&#9652;"; this.var1 = "", this.var3 = "" } else{ this.var2 = "&#9662;"; this.var1 = "", this.var3 = "" } this.getResults(); break
                case 3: if(this.ascdesc === true){ this.var3 = "&#9652;"; this.var2 = "", this.var1 = "" } else{ this.var3 = "&#9662;"; this.var2 = "", this.var1 = "" } this.getResults(); break
            }
        }
    },
    mounted() {
        this.getResults()
    },
    watch: {
        offset: function() {this.getResults()},
        limit: function() {this.offset = 0; this.getResults()},
        ascdesc: function() {this.setFilter(this.filterItem)},
    }
}
</script>


<style lang="scss">
.imagem {
    max-width: 100px;
}
table {
    color: #000;
}
.select {
    display: inline-flex;
    align-items: center;
    margin-left: 20px;
    float: left;
}

.pagination{    
    display: inline-flex;
    list-style-type: none;
    .page-item a:focus {
        outline: none;
    }

}
.pagination .page-item.active {
  background-color: #ddd;
  color: white;
  border-radius: 15px;
}
.pagination .page-item a {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
}
.pagination .page-item a:hover:not(.active) {
  background-color: #ddd;
  border-radius: 15px;
}

.expand {
    cursor: pointer;
}
.expand:hover {
    background-color: #DCDCDC;
}

.clickableHeader {
    cursor: pointer;
}
.clickableHeader:hover {
    background-color:#DCDCDC;
}
</style>