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

import {
    AppItem,
    Hamburger,
    NavCategory,
    NavCategoryItem,
    NavDivider,
    NavDrawer,
    NavDrawerBody,
    NavDrawerHeader,
    NavItem,
    NavSubItem,
    NavSubItemGroup,
} from "@fluentui/react-nav-preview";
import {
    Accessibility28Regular,
    ArrowExit20Filled,
    Board20Regular,
    GiftCard20Regular,
    People20Regular,
    Settings20Regular,
} from "@fluentui/react-icons";
import {Tooltip} from "@fluentui/react-components";
import {useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {useNavigate} from "react-router";

export function SideNavComponent({open, menuInfo, emit}: Readonly<{
    open: boolean,
    menuInfo: string,
    emit: (data: boolean) => void
}>) {
    const navigate = useNavigate();

    const webInfo = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const renderHamburgerWithToolTip = () => {
        return (
            <Tooltip content="菜单" relationship="label">
                <Hamburger onClick={() => emit(!open)}/>
            </Tooltip>
        );
    };

    return (
        <div className={"flex fixed top-0 left-0 h-full"}>
            <NavDrawer
                selectedValue={menuInfo}
                selectedCategoryValue={menuInfo}
                openCategories={["friends"]}
                open={open}
                type={"inline"}
                multiple={false}
                className={"shadow-lg"}
            >
                <NavDrawerHeader>{renderHamburgerWithToolTip()}</NavDrawerHeader>
                <NavDrawerBody>
                    <AppItem
                        icon={<Accessibility28Regular/>}
                        as="a"
                        href={"/"}
                        className={"flex items-center"}
                    >
                        {webInfo.site.site_name}
                    </AppItem>
                    <NavItem onClick={() => navigate("/admin/dashboard")} icon={<Board20Regular className={"h-full"}/>}
                             value="dashboard">
                        看板
                    </NavItem>
                    <NavCategory value="friends">
                        <NavCategoryItem icon={<People20Regular className={"h-full"}/>}>
                            友链
                        </NavCategoryItem>
                        <NavSubItemGroup>
                            <NavSubItem onClick={() => navigate("/admin/link")} value="link">友链管理</NavSubItem>
                            <NavSubItem value="location">位置管理</NavSubItem>
                            <NavSubItem value="color">颜色管理</NavSubItem>
                        </NavSubItemGroup>
                    </NavCategory>
                    <NavItem onClick={() => navigate("/admin/sponsor")} icon={<GiftCard20Regular className={"h-full"}/>}
                             value="sponsor">
                        赞助
                    </NavItem>
                    <NavItem onClick={() => navigate("/admin/setting")} icon={<Settings20Regular className={"h-full"}/>}
                             value="setting">
                        设置
                    </NavItem>
                    <NavDivider/>
                    <NavItem href={"/admin/dashboard"} icon={<ArrowExit20Filled className={"h-full"}/>} value="3">
                        退出
                    </NavItem>
                </NavDrawerBody>
            </NavDrawer>
        </div>
    );
}
