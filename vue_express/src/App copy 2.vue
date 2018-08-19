<template>
  <div id="app">
    <Table v-if='!err_msg.length' border :columns='columns' :data='car_list' :no-data-text='notice'></Table>
    <Alert v-else type='error'>{{err_msg}}</Alert>
    <Button type='primary' icon='md-add-circle' @click='modal = true'>Add a New Car</Button>
    <Modal
      v-model = 'modal' title='Add a New Car'
      @on-ok='add'
    >
      <Form :model='new_car' :label-width='60'>
        <FormItem label='Brand'>
          <Input v-model='new_car.brand'/>
        </FormItem>
        <FormItem label='Model'>
          <Input v-model='new_car.model'/>
        </FormItem>
        <FormItem label='Engine'>
          <Input v-model='new_car.engine'/>
        </FormItem>
        <FormItem label='Gearbox'>
          <Input v-model='new_car.gearbox'/>
        </FormItem>
      </Form>
    </Modal>
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
          title:'Action',
          render:(h,params)=>{
            return h('div',[
              h('Button',{
                props:{
                  type:'warning',
                  icon:'ios-trash'
                },
                on:{
                  click:()=>{
                    this.delete(params)
                  }
                }
              }),
              h('Button',{
                props:{
                  type:'primary',
                  icon:'ios-create'
                }
              })
            ])
          } // must be arrow func.
        }
      ],
      car_list:[], // retrieved rows
      notice:"", // special situation: no matching row
      err_msg:"", // db connection and query err, ajax err
      modal:false,
      new_car:{}
    }
  },
  methods:{
    add(){
      if(this.new_car.brand&&this.new_car.model&&this.new_car.engine&&this.new_car.gearbox){
        axios.post('http://localhost:3000/create',this.new_car)
        .then((res)=>{
          if(res.data[0]){
            this.new_car.car_info_id = res.data[1]
            // now new_car has the same structure as car_list
            this.car_list.push(this.new_car)
            this.new_car = {}
            this.modal = false // shut down modal
          }else{
            this.$Message.error({
            content:res.data[1],
            duration:0,
            closable:true
            })
          }
        })
        .catch((err)=>{
          this.$Message.error({
          content:'Ajax Error.',
          duration:0,
          closable:true
        })
        })
      }else{
        this.$Message.error({
          content:'Insufficient data, cannot create new table row',
          duration:0,
          closable:true
        })
      }
    },
    delete(params){
      console.log(params)
      axios.post(
        "http://localhost:3000/delete",
        {car_info_id:params.row.car_info_id}
      )
      .then((res)=>{
        if(res.data[0]){
          // delete ok
          this.car_list.splice(params.index,1)
        }else{
          // db err
          this.$Message.error({
            content:res.data[1],
            duration:0,
            closable:true
          })
        }
      })
      .catch((err)=>{
        // ajax err
         this.$Message.error({
            content:"Ajax Error",
            duration:0,
            closable:true
          })
      })
    }
  }
}
</script>

<style>
  li,p{font-size:18px;}
  Button{margin:5px}
</style>
