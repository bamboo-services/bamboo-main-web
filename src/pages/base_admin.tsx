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

import {Navigation24Filled} from "@fluentui/react-icons";
import {SideNavComponent} from "../components/admin/side_nav_component.tsx";
import {useEffect, useState} from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router";
import {AdminDashboard} from "./admin/admin_dashboard.tsx";
import {AdminLink} from "./admin/admin_link.tsx";
import {InfoUserAPI} from "../apis/api_info.ts";
import {useDispatch} from "react-redux";
import {setToaster} from "../stores/toaster_store.ts";
import {ToastStore} from "../models/store/toast_stores.ts";
import {animated, useSpring, useTransition} from "@react-spring/web";
import {easeQuadOut} from "d3-ease";
import {AdminLinkAdd} from "./admin/admin_link_add.tsx";
import {AdminSponsor} from "./admin/admin_sponsor.tsx";

export function BaseAdmin() {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [open, setOpen] = useState<boolean>(true);
    const [headerName, setHeaderName] = useState<string>("看板");
    const [menuInfo, setMenuInfo] = useState<string>("dashboard");

    useEffect(() => {
        if (location.pathname === "/admin" || location.pathname === "/admin/") {
            navigate("/admin/dashboard");
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        const func = async () => {
            const getResp = await InfoUserAPI();
            if (getResp?.output !== "Success") {
                dispatch(setToaster({
                    title: "提醒",
                    message: getResp?.error_message,
                    type: "info"
                } as ToastStore));
                navigate("/auth/login");
            }
        }

        func().then();
    }, [dispatch, navigate]);

    // 侧滑菜单的动画
    const slideStyles = useSpring({
        marginLeft: open ? 260 : 0,
        config: {
            duration: 200,
            easing: easeQuadOut,
        },
    });

    // 路由切换的动画
    const transitions = useTransition(location, {
        from: {opacity: 0, transform: "translateX(20px)"},
        enter: {
            opacity: 1,
            transform: "translateX(0)",
            config: {tension: 250, friction: 26},
        }
    });

    return (
        <div className={"flex min-h-dvh"}>
            <SideNavComponent open={open} emit={setOpen} menuInfo={menuInfo}/>
            <div className={"p-8 w-full"}>
                <animated.div style={slideStyles}>
                    <div className={"flex items-center space-x-3"}>
                        <button onClick={() => {
                            setOpen(!open)
                        }}>
                            <Navigation24Filled/>
                        </button>
                        <div className={"text-2xl font-medium"}>{headerName}</div>
                    </div>
                    <div className={"pt-3"}>
                        {transitions((style, item) => (
                            <animated.div style={style}>
                                <Routes location={item}>
                                    <Route
                                        path={"dashboard"}
                                        element={<AdminDashboard headerEmit={setHeaderName} menuEmit={setMenuInfo}/>}/>
                                    <Route
                                        path={"link"}
                                        element={<AdminLink headerEmit={setHeaderName} menuEmit={setMenuInfo}/>}/>
                                    <Route
                                        path={"link/add"}
                                        element={<AdminLinkAdd headerEmit={setHeaderName} menuEmit={setMenuInfo}/>}/>
                                    <Route
                                        path={"sponsor"}
                                        element={<AdminSponsor headerEmit={setHeaderName} menuEmit={setMenuInfo}/>}/>
                                    <Route
                                        path={"setting"}
                                        element={<div>设置</div>}/>
                                </Routes>
                            </animated.div>
                        ))}
                    </div>
                </animated.div>
            </div>
        </div>
    );
}
