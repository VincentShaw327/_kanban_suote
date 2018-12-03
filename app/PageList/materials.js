/*
**物料管理
*/
export const MaterialModel = {
    path: '/material/material_model',
    component: () => import( /* webpackChunkName: "TMaterialModel" */ '../pages/TWms/TMaterialModel' ),
}

export const ProductType = {
    path: '/product/category',
    component: () => import( /* webpackChunkName: "productCategory" */'../pages/product/category' ),
}

export const ProductList = {
    path: '/product/model',
    component: () => import( /* webpackChunkName: "productList" */'../pages/product/list' ),
}

export const BomManagement = {
    path: '/material/bom_list',
    component: () => import( /* webpackChunkName: "TBomList" */ '../pages/TBom/TBomList' ),
}
