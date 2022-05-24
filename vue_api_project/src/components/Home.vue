<template>
    <div>
        <!--swiper class="swiper" :options="swiperOption">
            <swiper-slide v-for="duel in duels" v-bind:key="duel.id"><img :src="duel.url"></swiper-slide>
        </swiper-->
        <div class="pop-duels">
            <h5>Duelos mais populares</h5>
            <ul>
                <li class="booking-card" v-for="duel in duels" v-bind:key="duel.id" :style='{ backgroundImage: `url(${duel.url})` }'>
                    <div class="book-container">
                        <div class="content">
                        <router-link class="btn" :to="{name: 'doduels', params: {slug: duel.slug}}">Fazer</router-link>
                        </div>
                    </div>
                    <div class="informations-container">
                        <h2 class="title">{{duel.nome}}</h2>
                        <p>{{ duel.items_num }} Itens<p>
                        <div class="more-information">
                            <div class="info-and-date-container">
                                <div class="box info">
                                    <svg class="icon" style="width:24px;height:24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
                                    </svg>
                                    <p>Completado:</p>
                                    <p>{{duel.feito}} vezes</p>
                                </div>
                                <div class="box date">
                                    <svg class="icon" style="width:24px;height:24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
                                    </svg>
                                    <p>Criado em:</p>
                                    <p>{{getData(duel.criado)}}</p>
                                </div>
                            </div>
                            <p class="descricao">{{duel.desc}}</p>
                        </div>
                    </div>
                </li>  
            </ul>
        </div>
        <!--chat></chat-->
        <footer>
            <div class="media">
                <a href="#" class="fa fa-instagram"></a>
                <a href="#" class="fa fa-facebook-square"></a>
                <a href="#" class="fa fa-twitter-square"></a>
            </div>
            <div class="info">
                <i class="fa fa-copyright"> Todos os direitos reservados. (Não)</i>
            </div>
        </footer>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import chat from './chat.vue'
export default {
    name: 'home',
    components: {
        Swiper,
        SwiperSlide,
        chat
    },
    data() {
        return {
            duels: [],
            items: [],
            swiperOption: {
                observer: true,
                observeParents: true,
                autoplay: true,
                loop: true,
                speed: 800,
                grabCursor: true,
            },
        }
    },
    methods: {
        getData(data) {
            var d = new Date(data)
            let dia = d.getDate()
            let mes = d.getMonth()+1
            let ano = d.getFullYear()
            return (dia+"/"+mes+"/"+ano)
        },
        getPopDuels() {
            const config = {
                method: 'get',
                url: '/api/popular',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br',
                }
            }
            this.axios(config).then(response => {
                this.duels = response.data
                this.getTotalItems()
            }).catch((error) => {
                console.log(error)
            })
        },
        getTotalItems() {
            const config = {
                method: 'get',
                url: '/api/item',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'X-CSRFToken': $cookies.get('csrftoken'),
                    'Accept-Language': 'pt-br'
                }
            }
            this.axios(config).then(response => {
                this.items = response.data
                this.linkDuelsAndItems()
            }).catch(error => {
                console.log(error)
            })
        },
        linkDuelsAndItems() {
            var self = this
            var items_num=0
            for(var d in self.duels) {
            const duel = self.duels[d]
            for(var i in self.items) {
                if(self.items[i].duel == duel.id) {
                items_num++
                Object.assign(self.duels[d], {'url': self.items[i].url})
                }
            }
            Object.assign(self.duels[d], {'items_num': items_num})
            items_num=0
            }
            this.$forceUpdate()
        },
    },
    mounted() {
        this.getPopDuels()
    }
}
</script>

<style lang="scss" scoped>
        $font : 'Sofia', sans-serif;
$font-size:16px;
$blue : #0a4870;
$blue2 : #e3ebf1;
$black: #000;
$grey : #7d7d7d;
$grey2 : #f0f0f0;
$grey3 : #e8e7e7;
$grey4 : #fdfdfd;
$bluegrey : #49606e;
$orange: #ec992c;

@mixin radius($val) {
  -webkit-border-radius: $val;
  -moz-border-radius: $val;
  border-radius: $val;
}
footer {
    align-items: center;
    background-color: #333;
    color: white;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    margin-top: 5px;
    bottom: 0;
    position: -webkit-sticky; /* Safari */
    position: fixed;
    width: 100%;
}
.fa {
    font-size: 40px;
    margin: 5px;
}
.fa.fa-copyright {
    justify-self: center;
    margin: 5px;
    color: #0366ee;
    font-size: 18px;
}
.pop-duels {
    margin: auto;
    width: auto;
    max-width: 1400px;
}

@mixin cardsOpen() {
    &::before {
      background: rgba(10,72,112, 0.6);
    }
    .book-container {
      .content {
        opacity: 1;

        transform: translateY(0px);
      }
    }

    .informations-container {      
      transform: translateY(0px);
      .more-information {
        opacity: 1;
      }
    }
}

*{
  margin: 0;
  padding: 0;
  
  font-family: $font;
}

h2{
  color: #000000;
  font-weight: 500;
}

ul{
    display: inline-flex;
    flex-wrap: wrap;

    list-style: none;
    padding:0;
  
  .booking-card{
    position: relative;
    width: 300px;
    display: flex;
    flex: 0 0 300px;
    flex-direction: column;
    
    margin: 20px;
    margin-bottom: 30px;
    @include radius(10px);
    
    overflow: hidden;
    
    background-position: center center;
    background-size: cover;
    
    text-align: center;
    color: #000000;
    
    transition: .3s;
    
    &::before{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      
      background: rgba(10,72,112, 0);
      
      transition: .3s;
    }
    
    .book-container {
      height: 200px;
      .content {
        position: relative;
        opacity: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        
        transform: translateY(-200px);
        
        transition: .3s;
        
        .btn {      
          border: 3px solid white;
          padding: 10px 15px;
          
          background: none;
          
          text-transform: uppercase;
          font-weight: bold;
          font-size: 1.3em;
          color: white;
          
          cursor: pointer;
          
          transition: .3s;
          
          &:hover {
            background: white;
            text-decoration: none;
            border: 0px solid white;
            
            color: $blue;
          }
        }
      }
    }
    
    .informations-container{      
      flex: 1 0 auto;
      
      padding: 20px;
      
      background: $grey2;
      
      transform: translateY(206px);
      
      transition: .3s;
      
      .title {
        position: relative;
        
        padding-bottom: 10px;
        margin-bottom: 10px;
        
        font-weight: bold;
        font-size: 1.2em;
        
        &::after{
          content: '';
          
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          
          height: 3px;
          width: 50px;
          
          margin: auto;
          
          background: $blue;
        }
      }
      
      .price {
        display: flex;
        align-items: center;
        justify-content: center;
        
        margin-top: 10px;
        
        .icon {
          margin-right: 10px;
        }
      }
      
      .more-information {
        opacity: 0;
        
        transition: .3s;
        .info-and-date-container {
          display: flex;

          .box {
            flex: 1 0;

            padding: 15px;
            margin-top: 20px;
            @include radius(10px);

            background: white;

            font-weight: bold;
            font-size: 0.9em;

            .icon {
              margin-bottom: 5px;
            }

            &.info{
              color: $orange;

              margin-right: 10px;
            }
          }
        }
        .descricao {
          margin-top: 20px;

          font-size: 0.8em;
          color: #000000;
        }
      }
    }
    
    &:hover {
      @include cardsOpen();
    }
  }
}

@media (max-width: 768px) {
  ul {
    .booking-card{
      @include cardsOpen();
    }
  }
}

.credits{
  display: table;
  background: $blue;
  color: white;
  line-height: 25px;
  
  margin: 10px auto;
  padding: 20px;
  
  @include radius(10px);
  
  text-align: center;
  
  a{
    color: $blue2;
  }
}

h1{
  margin: 10px 20px;
}
.swiper-container img{
    height: 500px;
    max-width: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
}
</style>