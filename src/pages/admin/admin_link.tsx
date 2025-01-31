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
import defaultBackground from "../../assets/images/default-background.webp";
import {AdminGetLinkAPI, AdminGetLocationAPI} from "../../apis/api_link.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import {LinkGetAdminEntity} from "../../models/entity/link_get_admin_entity.ts";

import noAvatar from "../../assets/images/no_avatar.png";
import {animated, useSprings} from "@react-spring/web";
import {LocationGetAdminEntity} from "../../models/entity/location_get_admin_entity.ts";
import {useNavigate} from "react-router";
import {Editor, Group, LinkInterrupt, LinkTwo, Seal, Search} from "@icon-park/react";

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
                <div className={"flex gap-1 p-1"}>
                    <button onClick={() => navigate("/admin/link/add")} className={"btn btn-primary btn-sm"}>
                        <LinkTwo theme="outline" size="16"/>
                        <span className={"text-sm"}>添加友链</span>
                    </button>
                    <button onClick={() => navigate("/admin/link/verify")} className={"btn btn-ghost btn-sm"}>
                        <Seal theme="outline" size="16"/>
                        <span className={"text-sm"}>友链审核</span>
                    </button>
                    <button className={"btn btn-ghost btn-sm"}>
                        <Group theme="outline" size="16"/>
                        <span className={"text-sm"}>友链组管理</span>
                    </button>
                    <div className={"divider divider-horizontal"}/>
                    <button className={"btn btn-ghost btn-sm"}>
                        <LinkInterrupt theme="outline" size="16"/>
                        <span className={"text-sm"}>检查失效友链</span>
                    </button>
                    <div className={"divider divider-horizontal"}/>
                    <select defaultValue="Pick a color" className="select select-sm w-min"
                            onChange={(data) => setSearchLocation(data.target.value)}>
                        <option value={""}>全部</option>
                        {adminLocationList?.locations?.map((data) => (
                            <option key={data.id} value={data.id}>{data.display_name}</option>
                        ))}
                    </select>
                    <label className="input input-sm">
                        <Search theme="outline" size="14"/>
                        <input type="search" className="grow" placeholder="查找"
                               onChange={(data) => setSearchValue(data.target.value)}/>
                    </label>
                </div>
            </div>
            <div className={"col-span-full lg:col-span-9"}>
                <div className={"grid grid-cols-1 lg:grid-cols-2 gap-3"}>
                    {adminLinkList.total !== 0 ? paginatedData.map((data, index) => (
                        <animated.div style={springs[index + 1]} key={data.id}>
                            <div
                                className="card w-full bg-base-100 hover:bg-base-200 transition card-sm shadow-sm border border-base-200">
                                <div className="card-body grid gap-1">
                                    <div className={"flex justify-between items-start"}>
                                        <div className={"flex items-center space-x-2"}>
                                            <img
                                                className="rounded-md size-10"
                                                src={data.site_logo}
                                                alt={data.id.toString()}
                                                onError={(e) => {
                                                    e.currentTarget.src = noAvatar;
                                                    e.currentTarget.onerror = null;
                                                }}
                                            />
                                            <div className={"flex flex-col"}>
                                                <a href={data.site_url} rel={"noreferrer noopener"}
                                                   target={"_blank"}
                                                   className={"font-bold transition hover:text-secondary"}>{data.site_name}</a>
                                                {
                                                    data.webmaster_email ? (
                                                        <a href={`mailto:${data.webmaster_email}`}
                                                           rel={"noreferrer noopener"}
                                                           className={"transition line-clamp-1 w-64 text-base-content hover:text-secondary font-thin"}>
                                                            {data.webmaster_email || "NULL"}
                                                        </a>
                                                    ) : (
                                                        <div className={"line-clamp-1 w-64 text-white font-thin"}>
                                                            NULL
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <button className={"btn btn-sm btn-square btn-ghost hover:text-secondary p-2"} type={"button"}
                                                onClick={() => navigate(`/admin/link/edit/${data.id}`)}>
                                            <Editor theme="outline" size="20"/>
                                        </button>
                                    </div>
                                    <p className="m-0 line-clamp-2">
                                        {data.site_description || "这个站长很懒，没有写对应的描述内容......"}
                                    </p>
                                </div>
                            </div>
                        </animated.div>
                    )) : "暂时没有友链呢"}
                    <animated.div style={springs[paginatedData.length + 1]}
                                  className="col-span-full justify-center items-center mt-4 flex space-x-1">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="transition btn btn-sm disabled:opacity-50"
                        >
                            上一页
                        </button>
                        <div className="flex space-x-1">
                            {Array.from({length: totalPages}, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`transition btn btn-sm ${
                                        currentPage === i + 1 ? "btn-primary text-primary-content" : null
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="transition btn btn-sm disabled:opacity-50"
                        >
                            下一页
                        </button>
                    </animated.div>
                </div>
            </div>
            <animated.div className={"lg:col-span-3 hidden lg:block"} style={springs[0]}>
                <div className="card bg-base-100 card-sm shadow-sm">
                    <figure>
                        <img src={defaultBackground} alt={"background-image"}/>
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">友链状态</h2>
                        <p>概览统计信息</p>
                        <div className="card-actions">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>状态</th>
                                    <th>值</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>总连接数</td>
                                    <td>{adminLinkList.total || 0} 个</td>
                                </tr>
                                <tr>
                                    <td>待审核数</td>
                                    <td>{adminLinkList.reviewed || 0} 个</td>
                                </tr>
                                <tr>
                                    <td>最近添加</td>
                                    <td>{adminLinkList.recently_added || 0} 个</td>
                                </tr>
                                <tr>
                                    <td>最近修改</td>
                                    <td>{adminLinkList.recently_modified || 0} 个</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </animated.div>
        </div>
    );
}
