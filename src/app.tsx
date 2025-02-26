/*
 * --------------------------------------------------------------------------------
 * Copyright (c) 2016-NOW(至今) 筱锋
 * Author: 筱锋(https://www.x-lf.com)
 *
 * 本文件包含 XiaoMain 的源代码，该项目的所有源代码均遵循MIT开源许可证协议。
 * --------------------------------------------------------------------------------
 * 许可证声明：
 *
 * 版权所有 (c) 2016-2024 筱锋。保留所有权利。
 *
 * 本软件是“按原样”提供的，没有任何形式的明示或暗示的保证，包括但不限于
 * 对适销性、特定用途的适用性和非侵权性的暗示保证。在任何情况下，
 * 作者或版权持有人均不承担因软件或软件的使用或其他交易而产生的、
 * 由此引起的或以任何方式与此软件有关的任何索赔、损害或其他责任。
 *
 * 使用本软件即表示您了解此声明并同意其条款。
 *
 * 有关MIT许可证的更多信息，请查看项目根目录下的LICENSE文件或访问：
 * https://opensource.org/licenses/MIT
 * --------------------------------------------------------------------------------
 * 免责声明：
 *
 * 使用本软件的风险由用户自担。作者或版权持有人在法律允许的最大范围内，
 * 对因使用本软件内容而导致的任何直接或间接的损失不承担任何责任。
 * --------------------------------------------------------------------------------
 */

import {Toast, ToastBody, Toaster, ToastTitle, useId, useToastController} from "@fluentui/react-components";
import {Route, Routes} from "react-router";
import {BaseIndex} from "./pages/base_index.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ToastStore} from "./models/store/toast_stores.ts";
import {useEffect} from "react";
import {clearToaster, setToaster} from "./stores/toaster_store.ts";
import BaseAuth from "./pages/base_auth.tsx";
import {InfoAPI} from "./apis/api_info.ts";
import {setWebInfo} from "./stores/web_info_store.ts";
import {BaseAdmin} from "./pages/base_admin.tsx";
import {BaseAbout} from "./pages/base_about.tsx";
import {Demo} from "./pages/demo.tsx";
import {BaseOperate} from "./pages/base_operate.tsx";

export function App() {
    const dispatch = useDispatch();
    const toasterStore = useSelector((state: { toasters: ToastStore }) => state.toasters);

    const toasterId = useId(toasterStore.toastId);
    const {dispatchToast} = useToastController(toasterId);

    useEffect(() => {
        if (toasterStore.show) {
            dispatchToast(
                <Toast>
                    <ToastTitle>{toasterStore.title}</ToastTitle>
                    {toasterStore.message !== "" ? <ToastBody>{toasterStore.message}</ToastBody> : null}
                </Toast>,
                {
                    position: "top-end",
                    intent: toasterStore.type
                }
            );
            setTimeout(() => {
                dispatch(clearToaster());
            }, 5000);
        }
    }, [dispatch, dispatchToast, toasterStore]);

    useEffect(() => {
        if (localStorage.getItem("WebInfo") == null) {
            setTimeout(async () => {
                const getRes = await InfoAPI();
                if (getRes?.output === "Success") {
                    dispatch(setWebInfo(getRes.data!));
                    localStorage.setItem("WebInfo", JSON.stringify(getRes.data!));
                } else {
                    dispatch(
                        setToaster({
                            message: getRes?.error_message,
                            type: "error",
                            title: getRes?.message,
                        } as ToastStore)
                    );
                }
            });
        } else {
            dispatch(setWebInfo(JSON.parse(localStorage.getItem("WebInfo")!)));
        }
    }, [dispatch]);

    return (
        <>
            <Toaster toasterId={toasterId}/>
            <Routes>
                <Route path={"/"} element={<BaseIndex/>}/>
                <Route path={"/about/*"} element={<BaseAbout/>}/>
                <Route path={"/operate/*"} element={<BaseOperate/>}/>
                <Route path={"/auth/*"} element={<BaseAuth/>}/>
                <Route path={"/admin/*"} element={<BaseAdmin/>}/>
                <Route path={"/debug"} element={<Demo/>}/>
            </Routes>
        </>
    );
}
