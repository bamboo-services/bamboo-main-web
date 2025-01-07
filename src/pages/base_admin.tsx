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

export function BaseAdmin() {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(true);
    const [headerName, setHeaderName] = useState<string>("看板");
    const [menuInfo, setMenuInfo] = useState<string>("dashboard");

    useEffect(() => {
        if (location.pathname === "/admin" || location.pathname === "/admin/") {
            navigate("/admin/dashboard");
        }
    }, [location.pathname, navigate]);

    return (
        <div className={"flex min-h-dvh"}>
            <SideNavComponent open={open} emit={setOpen} menuInfo={menuInfo}/>
            <div className={"p-8"}>
                <div className={"flex items-center space-x-3"}>
                    <button onClick={() => {
                        setOpen(!open)
                    }}>
                        <Navigation24Filled/>
                    </button>
                    <div className={"text-2xl font-medium"}>{headerName}</div>
                </div>
                <div className={"pt-3"}>
                    <Routes>
                        <Route path={"dashboard"} element={<AdminDashboard headerEmit={setHeaderName} menuEmit={setMenuInfo}/>}/>
                        <Route path={"link"} element={<AdminLink headerEmit={setHeaderName} menuEmit={setMenuInfo}/>}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}
