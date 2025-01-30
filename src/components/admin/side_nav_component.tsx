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

import {useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {Link, useNavigate} from "react-router";
import {useEffect} from "react";
import {
    ColorFilter,
    Dashboard,
    FriendsCircle,
    Home,
    Link as LinkImage,
    LocalTwo,
    Logout,
    Other,
    OvalLoveTwo,
    Setting
} from "@icon-park/react";
import {BambooSVG} from "../../assets/svg/bamboo_svg.tsx";

export function SideNavComponent({open, menuInfo, emit}: Readonly<{
    open: boolean,
    menuInfo: string,
    emit: (data: boolean) => void
}>) {
    const navigate = useNavigate();

    const webInfo = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const hasSelected = (menu: string) => {
        return menu === menuInfo ?
            "flex items-center bg-primary font-medium text-primary-content"
            : "flex items-center";
    }

    useEffect(() => {
        if (open) {
            document.getElementById("nav")?.classList.add("lg:drawer-open")
        } else {
            document.getElementById("nav")?.classList.remove("lg:drawer-open");
        }
        emit(open);
    }, [open, emit]);

    return (
        <div className={"flex fixed top-0 left-0 h-full"}>
            <div id={"nav"} className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle"/>
                <div className="drawer-content flex flex-col items-center justify-center">
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        打开菜单
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-64 p-4 space-y-0.5">
                        <button className={"flex items-center justify-center space-x-1"}
                                onClick={() => navigate("/")}>
                            <BambooSVG size={32}/>
                            <span className={"text-3xl font-bold"}>{webInfo.site.site_name}</span>
                        </button>
                        <div className={"text-lg mt-4 mb-1 flex space-x-1 items-center"}>
                            <Home theme="outline" size="20"/>
                            <span>首页</span>
                        </div>
                        <li className={"text-base"}>
                            <Link to={"/admin/dashboard"} className={hasSelected("dashboard")}>
                                <Dashboard theme="outline" size="16"/>
                                <span>看板</span>
                            </Link>
                        </li>
                        <div className={"text-lg mt-4 mb-1 flex space-x-1 items-center"}>
                            <FriendsCircle theme="outline" size="20"/>
                            <span>友链</span>
                        </div>
                        <li className={"text-base"}>
                            <Link to={"/admin/link"} className={hasSelected("link")}>
                                <LinkImage theme="outline" size="16"/>
                                <span>友链管理</span>
                            </Link>
                        </li>
                        <li className={"text-base"}>
                            <Link to={"/admin/location"} className={hasSelected("location")}>
                                <LocalTwo theme="outline" size="16"/>
                                <span>位置管理</span>
                            </Link>
                        </li>
                        <li className={"text-base"}>
                            <Link to={"/admin/color"} className={hasSelected("color")}>
                                <ColorFilter theme="outline" size="16"/>
                                <span>颜色管理</span>
                            </Link>
                        </li>
                        <div className={"text-lg mt-4 mb-1 flex space-x-1 items-center"}>
                            <Other theme="outline" size="20"/>
                            <span>其他</span>
                        </div>
                        <li className={"text-base"}>
                            <Link to={"/admin/sponsor"} className={hasSelected("sponsor")}>
                                <OvalLoveTwo theme="outline" size="16"/>
                                <span>赞助</span>
                            </Link>
                        </li>
                        <li className={"text-base"}>
                            <Link to={"/admin/setting"} className={hasSelected("setting")}>
                                <Setting theme="outline" size="16"/>
                                <span>设置</span>
                            </Link>
                        </li>
                        <li className={"text-base"}>
                            <Link to={"/"} className={hasSelected("logout")}>
                                <Logout theme="outline" size="16"/>
                                <span>退出</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
