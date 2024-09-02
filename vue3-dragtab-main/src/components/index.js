import DragTab from '@/components/DragTab'

export default {
  install:(app)=>{
    app.component(DragTab.name,DragTab);
  }
}