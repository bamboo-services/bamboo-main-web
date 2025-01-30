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

import {useDispatch, useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardFooter,
    CardHeader,
    CardPreview,
    SearchBox,
    Select,
    Toolbar,
    ToolbarButton,
    ToolbarDivider
} from "@fluentui/react-components";
import {
    CheckmarkStarburstRegular,
    LinkDismissFilled,
    LinkFilled,
    PenRegular,
    TabGroupRegular
} from "@fluentui/react-icons";
import defaultBackground from "../../assets/images/default-background.webp";
import {AdminGetLinkAPI, AdminGetLocationAPI} from "../../apis/api_link.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import {LinkGetAdminEntity} from "../../models/entity/link_get_admin_entity.ts";

import noAvatar from "../../assets/images/no_avatar.png";
import {animated, useSprings} from "@react-spring/web";
import {LocationGetAdminEntity} from "../../models/entity/location_get_admin_entity.ts";
import {useNavigate} from "react-router";

export function AdminLink({headerEmit, menuEmit}: Readonly<{
    headerEmit: (data: string) => void,
    menuEmit: (data: string) => void
}>) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const webInfo = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const [adminLinkList, setAdminLinkList] = useState<LinkGetAdminEntity>({total: 0} as LinkGetAdminEntity);
    const [adminLocationList, setAdminLocationList] = useState<LocationGetAdminEntity>({} as LocationGetAdminEntity);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchLocation, setSearchLocation] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1); // 当前页码
    const itemsPerPage = 10; // 每页展示数量

    document.title = `友链 | ${webInfo.site.site_name}`

    useEffect(() => {
        headerEmit("友链");
        menuEmit("link");
    }, [headerEmit, menuEmit]);

    useEffect(() => {
        const func = async () => {
            const getResp = await AdminGetLinkAPI();
            if (getResp?.output === "Success") {
                const filterData = getResp.data?.links?.filter(data => data.location !== 0);
                if (filterData) {
                    setAdminLinkList({...getResp.data!, links: filterData});
                }
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error"
                } as ToastStore));
            }
        }
        func().then();
    }, [dispatch]);

    useEffect(() => {
        const func = async () => {
            const getResp = await AdminGetLocationAPI();
            if (getResp?.output === "Success") {
                setAdminLocationList(getResp.data!);
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error"
                } as ToastStore));
            }
        }
        func().then();
    }, [dispatch]);

    const getLinkDO = () => {
        return adminLinkList?.links?.filter(data => {
            if (searchLocation === "" || searchLocation === null) {
                return true;
            } else {
                return data.location.toString() === searchLocation;
            }
        }).filter(data => {
            if (searchValue === "" || searchValue === null) {
                return true;
            } else {
                return data.site_name.includes(searchValue) || data.site_url.includes(searchValue) || data.webmaster_email.includes(searchValue) || data.site_description.includes(searchValue);
            }
        }) || [];
    }

    const totalPages = Math.ceil(getLinkDO().length / itemsPerPage);
    // 获取当前页数据
    const paginatedData = getLinkDO().slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const [springs] = useSprings(paginatedData.length + 2 || 2, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(20px)"},
        delay: index * 25,
        config: {tension: 170, friction: 26},
    }));

    return (
        <div className={"grid grid-cols-12 gap-3 border-t"}>
            <div className={"col-span-full border-b py-1"}>
                <Toolbar className={"flex gap-1"}>
                    <ToolbarButton appearance={"primary"} onClick={() => {navigate("/admin/link/add")}}
                                   icon={<LinkFilled fontSize={24}/>}>
                        添加友链
                    </ToolbarButton>
                    <ToolbarButton appearance={"subtle"}
                                   icon={<CheckmarkStarburstRegular fontSize={24}/>}>
                        友链审核
                    </ToolbarButton>
                    <ToolbarButton appearance={"subtle"}
                                   icon={<TabGroupRegular fontSize={24}/>}>
                        友链组管理
                    </ToolbarButton>
                    <ToolbarDivider/>
                    <ToolbarButton appearance={"subtle"}
                                   icon={<LinkDismissFilled fontSize={24}/>}>
                        检查失效友链
                    </ToolbarButton>
                    <ToolbarDivider/>
                    <div className={"hidden lg:block"}>
                        <Select onChange={(_, data) => {
                            setSearchLocation(data.value);
                        }}>
                            <option value={""}>全部</option>
                            {adminLocationList?.locations?.map((data) => (
                                <option key={data.id} value={data.id}>{data.display_name}</option>
                            ))}
                        </Select>
                    </div>
                    <div className={"hidden lg:block"}>
                        <SearchBox onChange={(_, data) => setSearchValue(data.value)} value={searchValue}/>
                    </div>
                </Toolbar>
            </div>
            <div className={"col-span-full lg:col-span-9"}>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-3"}>
                    {adminLinkList.total !== 0 ? paginatedData.map((data, index) => (
                        <animated.div style={springs[index + 1]} key={data.id}>
                            <Card key={data.id} className="w-full shadow-lg transition hover:bg-gray-100/75">
                                <CardHeader
                                    image={
                                        <img
                                            className="rounded-md min-w-10"
                                            src={data.site_logo}
                                            alt={data.id.toString()}
                                            onError={(e) => {
                                                e.currentTarget.src = noAvatar;
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                    }
                                    header={
                                        <a href={data.site_url} rel={"noreferrer noopener"}
                                           target={"_blank"} className={"font-bold transition hover:text-[#199910]"}>
                                            {data.site_name}
                                        </a>
                                    }
                                    description={
                                        data.webmaster_email ? (
                                            <a href={`mailto:${data.webmaster_email}`} rel={"noreferrer noopener"}
                                               className={"transition line-clamp-1 w-64 text-gray-500 hover:text-gray-900 font-thin"}>
                                                {data.webmaster_email || "NULL"}
                                            </a>
                                        ) : (
                                            <div className={"line-clamp-1 w-64 text-white font-thin"}>
                                                NULL
                                            </div>
                                        )
                                    }
                                    action={
                                        <Button
                                            appearance="transparent"
                                            icon={<PenRegular fontSize={24}/>}
                                            aria-label="Edit"
                                            onClick={() => navigate(`/admin/link/edit/${data.id}`)}
                                        />
                                    }
                                />
                                <p className="m-0 line-clamp-2">
                                    {data.site_description || "这个站长很懒，没有写对应的描述内容......"}
                                </p>
                            </Card>
                        </animated.div>
                    )) : "暂时没有友链呢"}
                    <animated.div style={springs[paginatedData.length + 1]}
                                  className="col-span-full justify-center items-center mt-4 flex">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="transition px-4 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            上一页
                        </button>
                        <div className="flex">
                            {Array.from({length: totalPages}, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`transition px-3 py-1 mx-1 rounded ${
                                        currentPage === i + 1 ? "bg-[#1C8912] text-white" : "bg-gray-200"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="transition px-4 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
                        >
                            下一页
                        </button>
                    </animated.div>
                </div>
            </div>
            <animated.div className={"lg:col-span-3 hidden lg:block"} style={springs[0]}>
                <Card className={"m-auto w-full shadow-md rounded-lg bg-white"}>
                    <CardPreview>
                        <img
                            className="object-cover w-full h-36"
                            src={defaultBackground}
                            alt="背景图"
                        />
                    </CardPreview>
                    <CardHeader
                        header={<div className="text-xl font-bold text-gray-800">友链状态</div>}
                        description={<div className="text-sm text-gray-500">概览统计信息</div>}
                    />
                    <CardFooter>
                        <div className={"grid gap-3 px-4 py-3"}>
                            <div className="grid grid-cols-2 text-gray-700">
                                <span className="font-medium">总链接数</span>
                                <span
                                    className="text-right font-bold text-blue-600">{adminLinkList.total || 0} 个</span>
                            </div>
                            <div className="grid grid-cols-2 text-gray-700">
                                <span className="font-medium">待审核数</span>
                                <span className="text-right font-bold text-blue-600">
                                    {adminLinkList.reviewed || 0} 个
                                </span>
                            </div>
                            <div className="grid grid-cols-2 text-gray-700">
                                <span className="font-medium">最近添加</span>
                                <span className="text-right font-bold text-blue-600">
                                    {adminLinkList.recently_added || 0} 个
                                </span>
                            </div>
                            <div className="grid grid-cols-2 text-gray-700">
                                <span className="font-medium">最近修改</span>
                                <span className="text-right font-bold text-blue-600">
                                    {adminLinkList.recently_modified || 0} 个
                                </span>
                            </div>
                            <div className="grid grid-cols-2 text-gray-700">
                                <span className="font-medium">已删除</span>
                                <span className="text-right font-bold text-blue-600">
                                    {adminLinkList?.links?.filter(link => link.deleted_at !== null).length} 个
                                </span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </animated.div>
        </div>
    );
}
