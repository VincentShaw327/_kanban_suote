/**
 *这是用户列表页
 *添加日期:2018.03.03
 *添加人:shaw
 **/
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import { Button, Icon, Popover,message,Breadcrumb,Divider,Table,Card,Row,Col,Select,Input,Popconfirm  } from 'antd';
// import FeatureSetConfig from 'components/TCommon/tableConfig';
import MD5 from 'components/TCommon/md5';
import { TPostData } from '../../utils/TAjax';
import SimpleTable from 'components/TTable/SimpleTable';
import { CreateModal,UpdateModal } from 'components/TModal';
import {SimpleQForm,StandardQForm } from 'components/TForm';

let seft;
let creatKeyWord;


export default class TAuthList extends Component {

    constructor( props ) {
        super( props )
        this.state = {
            tableDataList:[],
            updateFromItem:{},
            total:0,
            current:1,
            pageSize:10,
            UModalShow:false,
            loading:true,
            keyWord:''
        }
        this.url= '/api/TUser/auth';
        seft = this;
    }

    componentWillMount(){
        this.getTableList();
        const config = {

            type: 'tableFeature',
            uProductUUID: 0,
            url: '/api/TUser/auth',

            columns: [
                {
                    title: '序号',
                    dataIndex: 'key',
                    type: 'string'
                },
                {
                    title: '权限名称',
                    dataIndex: 'Name',
                    type: 'string'
                }, {
                    title: '权限编号',
                    dataIndex: 'Code',
                    type: 'string'

                }, {
                    title: '备注',
                    dataIndex: 'Note',
                    type: 'string'
                }, {
                    title: '修改时间',
                    dataIndex: 'UpdateDateTime',
                    type: 'string'
                }, {
                    title: '操作',
                    dataIndex: 'uMachineUUID',
                    type: 'operate',
                    btns: [
                        {
                            text: '修改',
                            type: 'edit',
                            icon: 'edit'
                        }, {
                            text: '删除',
                            type: 'delete',
                            icon: 'delete',
                            havePopconfirm: true,
                            popText: '确定要删除此记录吗?'
                        }
                    ]
                }
            ],

            UType: [
                {
                   name: 'Name',
                   label: '权限名称',
                   type: 'string',
                   placeholder: '请输入权限名称',
                   rules: [{required: true, message: '编号名不能为空'}]
               },
               {
                    name: 'Code',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入权限编号',
                    rules: [{required: true,message: '权限编号不能为空'}]
                },
                {
                    name: 'Desc',
                    label: '描述',
                    type: 'string',
                    placeholder: '请输入描述',
                },
                {
                    name: 'Note',
                    label: '备注',
                    type: 'string',
                    placeholder: '请输入备注',
                }
            ],

            CType: [
                {
                   name: 'Name',
                   label: '权限名称',
                   type: 'string',
                   placeholder: '请输入权限名称',
                   rules: [{required: true, message: '编号名不能为空'}]
               },
                {
                    name: 'Code',
                    label: '编号',
                    type: 'string',
                    placeholder: '请输入权限编号',
                    rules: [{required: true,message: '权限编号不能为空'}]
                }
            ],

            RType: [
                {
                    name: 'keyWord',
                    label: '搜索内容',
                    type: 'string',
                    placeholder: '请输入搜索内容'
                }
            ],

            pageData: function ( num, callback ) {

                var dat = {
                    PageIndex:0,
                    PageSize: -1
                }

                TPostData( this.url, "ListActive", dat, function ( res ) {
                    console.log( 'res', res );
                    var list = [];
                    var Ui_list = res.obj.objectlist || [];
                    var totalcount = res.obj.totalcount;
                    creatKeyWord = totalcount;
                    Ui_list.forEach( function ( item, index ) {
                        list.push( {
                            key: index,
                            UUID : item.UUID, //UUID，后台使用的记录唯一编号，不需要在操作界面上显示，更改等等
                            Name : item.Name,//名称
                            Code : item.Code,//代码
                            Note : item.Note,//信息备注
                            UpdateDateTime : item.UpdateDateTime,//最后更新时间
                            Status :item.Status,
                            Desc :item.Desc,//详细描述
                            SystemUUID:item.SystemUUID //保留
                        } )
                    } )
                    const pagination = {
                        ...seft.state.pagination
                    }
                    pagination.total = totalcount;
                    callback( list, {
                        total: pagination.total,
                        nPageSize: 10
                    } )
                }, function ( error ) {
                    message.info( error );
                } )
            },

            Create: function ( data, callback ) {
                let password = MD5( data.Password );

                let dat = {
                    // key: keyWord,
                    Name: data.Name,
                    Code: data.Code,
                }

                TPostData( this.url, "Add", dat, function ( res ) {

                    callback( dat );
                } )
            },

            Update: function ( data, callback ) {
                let dat = {
                    UUID: data.UUID,
                    SystemUUID: 0,
                    Name: data.Name,
                    Code: data.Code,
                    Note: data.Note,
                    Desc: "--"
                }
                TPostData( this.url, "Update", dat, function ( res ) {
                    callback( data );
                } )
            },

            Delete: function ( data, callback ) {
                var dat = {
                    UUID: data.UUID
                }
                TPostData( this.url, "Inactive", dat, function ( res ) {
                    callback( data );
                } )
            },

            Retrieve: function ( data, callback ) {
                this.KeyWord = data.id;
                var dat = {
                    PageIndex: 0, //分页：页序号，不分页时设为0
                    PageSize: -1, //分页：每页记录数，不分页时设为-1
                    KeyWord: this.keyWord //模糊查询条件
                }
                this.uProductUUID = data.stype;
                TPostData( this.url, "ListActive", dat, function ( res ) {
                    console.log( 'ListActive', res );
                    var list = [],
                        Ui_list = res.obj.objectlist || [],
                        totalcount = res.obj.totalcount
                    let i = 0;
                    Ui_list.forEach( function ( ele ) {
                        ele.key = i++;
                    } );
                    // 查询成功 传入列表数据
                    callback( Ui_list );
                }, function ( error ) {
                    message.info( error );
                } )
            }

        };
        // this.feature = FeatureSetConfig( config );

    }

    getTableList(que){
        const {current,pageSize,keyWord}=this.state;
        const dat = {
            PageIndex : current-1,       //分页：页序号，不分页时设为0
            PageSize:pageSize,   //分页：每页记录数，不分页时设为-1
            SystemUUID: -1,
            KeyWord :keyWord,
        }

        TPostData( this.url, "ListActive", dat,
            (res) => {
                var list = [];
                console.log("查询到工作中心类别列表", res);
                var data_list = res.obj.objectlist || [];
                var totalcount = res.obj.totalcount;
                data_list.forEach((item, index)=> {
                    list.push( {
                        key: index,
                        UUID : item.UUID, //UUID，后台使用的记录唯一编号，不需要在操作界面上显示，更改等等
                        Name : item.Name,//名称
                        Code : item.Code,//代码
                        Note : item.Note,//信息备注
                        UpdateDateTime : item.UpdateDateTime,//最后更新时间
                        Status :item.Status,
                        Desc :item.Desc,//详细描述
                        SystemUUID:item.SystemUUID //保留
                    } )
                })
                this.setState({ tableDataList: list, total: totalcount, loading: false });
            },
            ( error )=> {
              message.info( error );
            }
        )

    }

    handleCreat=(data)=>{
        let dat = {
            Name: data.Name,
            Code: data.Code
        }
        TPostData( this.url, "Add", dat,
            ( res )=> {
                message.success("创建成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("创建失败！");
                console.log('err',err);
            }
        )
    }

    handleUpdate=(data)=>{
        let dat = {
            UUID: this.state.updateFromItem.UUID,
            SystemUUID: 0,
            Name: data.Name,
            Code: data.Code,
            Note: data.Note,
            Desc: "--"
        }

        TPostData( this.url, "Update", dat,
            ( res )=> {
                message.success("更新成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("更新失败！");
                console.log('err',err);
            }
        )
    }

    handleDelete=(data)=>{
        var dat = {
            UUID: data.UUID,
        }
        // console.log("看看data",data);
        TPostData( this.url, "Inactive", dat,
            ( res )=> {
                message.success("删除成功！");
                this.getTableList();
            },
            ( err )=> {
                message.error("删除失败！");
                console.log('err',err);
            }
        )
    }

    handleQuery=(data)=>{
        const {keyWord}=data;
        this.setState({keyWord},()=>{
            this.getTableList();
        });
    }

    handleTableChange=(pagination)=>{
        // console.log('pagination',pagination);
        const {current,pageSize}=pagination;
        this.setState({current,pageSize,loading:true},()=>{
            this.getTableList();
        });
    }

    toggleUModalShow=(record)=>{
        this.setState({UModalShow:!this.state.UModalShow,updateFromItem:record});
    }

    render() {
        const {tableDataList,loading,current,total,pageSize,updateFromItem,UModalShow}=this.state;
        let Data={
            list:tableDataList,
            pagination:{total,current,pageSize}
        };

        //table表格表头参数
        const Tcolumns= [
            {
                title: '序号',
                dataIndex: 'key',
                type: 'string'
            },
            {
                title: '权限名称',
                dataIndex: 'Name',
                type: 'string'
            }, {
                title: '权限编号',
                dataIndex: 'Code',
                type: 'string'

            }, {
                title: '备注',
                dataIndex: 'Note',
                type: 'string'
            }, {
                title: '修改时间',
                dataIndex: 'UpdateDateTime',
                type: 'string'
            }, {
                title: '操作',
                dataIndex: 'UUID',
                render:(UUID,record)=>{
                    return <span>
                        <a onClick={this.toggleUModalShow.bind(this,record)}>编辑</a>
                        <Divider type="vertical"/>
                        <Popconfirm
                            placement="topRight"
                            title="确定删除此项数据？"
                            onConfirm={this.handleDelete.bind(this,record)}
                            okText="确定" cancelText="取消">
                            <a href="#">删除</a>
                        </Popconfirm>
                    </span>
                }
            }
        ];
        //更新弹框数据项
        const UFormItem= [
            {
               name: 'Name',
               label: '权限名称',
               type: 'string',
               placeholder: '请输入权限名称',
               rules: [{required: true, message: '编号名不能为空'}]
           },
           {
                name: 'Code',
                label: '编号',
                type: 'string',
                placeholder: '请输入权限编号',
                rules: [{required: true,message: '权限编号不能为空'}]
            },
            {
                name: 'Desc',
                label: '描述',
                type: 'string',
                placeholder: '请输入描述',
            },
            {
                name: 'Note',
                label: '备注',
                type: 'string',
                placeholder: '请输入备注',
            }
        ];
        //添加的弹出框菜单
        const CFormItem= [
            {
               name: 'Name',
               label: '权限名称',
               type: 'string',
               placeholder: '请输入权限名称',
               rules: [{required: true, message: '编号名不能为空'}]
           },
            {
                name: 'Code',
                label: '编号',
                type: 'string',
                placeholder: '请输入权限编号',
                rules: [{required: true,message: '权限编号不能为空'}]
            }
        ];
        //查询的数据项
        const RFormItem= [
            {
                name: 'keyWord',
                label: '搜索内容',
                type: 'string',
                placeholder: '请输入搜索内容'
            }
        ];


        return (
            <div className="cardContent">
               {/* <SimpleQForm
                    FormItem={RFormItem}
                    submit={this.handleQuery}
                    /> */}
                <CreateModal
                    FormItem={CFormItem}
                    submit={this.handleCreat.bind(this)}
                />
                <SimpleTable
                    size="middle"
                    loading={loading}
                    data={Data}
                    columns={Tcolumns}
                    isHaveSelect={false}
                    onChange={this.handleTableChange}
                />
                <UpdateModal
                    FormItem={UFormItem}
                    updateItem={updateFromItem}
                    submit={this.handleUpdate.bind(this)}
                    showModal={UModalShow}
                    hideModal={this.toggleUModalShow}
                />
            </div>
        )
    }
}
