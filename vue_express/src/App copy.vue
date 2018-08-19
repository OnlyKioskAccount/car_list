<template>
  <div id="app">
    <Table v-if='!err_msg.length' border :columns='columns' :data='car_list' :no-data-text='notice'></Table>
    <Alert v-else type='error'>{{err_msg}}</Alert>
  </div>
  
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  created(){
    axios.get("http://localhost:3000/retrieve")
    .then((res)=>{
      if(res.data[0]){
        // no problem
        if(res.data[1].length){
          // rows retrieved
          this.car_list=res.data[1]
          this.notice=""
          this.err_msg=""
        }else{
          // no matching row
          this.notice = "No Matching Row."
          this.car_list=[]
          this.err_msg = ""
        }
      }else{
        this.err_msg = res.data[1]
        this.car_list=[]
        this.notice=""
      }
    })
    .catch((err)=>{
      this.err_msg = "Sorry, AJAX Error."
      this.car_list=[]
      this.notice=""
    })
  },
  data(){
    return{
      columns:[
        {title:"Brand",key:"brand",align:"center"},
        {title:"Model",key:"model",align:"center"},
        {title:"Engine",key:"engine",align:"center"},
        {title:"Gearbox",key:"gearbox",align:"center"},
        {
          title:"Edit and Delete",
          key:"edit_delete",
          render:(h,params)=>{
            return h('div',[
              h('Button',{
                props:{
                  type:'primary',
                  icon:'ios-create',
                },
                on:{
                  click:()=>{
                    this.edit(params)
                  }
                }
              }),
              h('Button',{
                props:{
                  type:"warning",
                  icon:'ios-trash'
                }
              })
            ])
          }
        }
      ],
      car_list:[], // retrieved rows
      notice:"", // special situation: no matching row
      err_msg:"" // db connection and query err, ajax err
    }
  },
  methods:{
    edit(arg){
      console.log(arg)
      console.log(this.car_list[arg.index])
    }
  }
}
</script>

<style>
  li,p{font-size:18px;}
  Button{margin:5px}
</style>
