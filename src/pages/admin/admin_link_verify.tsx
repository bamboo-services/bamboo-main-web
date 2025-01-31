import {useDispatch, useSelector} from "react-redux";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {useEffect, useState} from "react";
import {LinkDO} from "../../models/entity/link_get_admin_entity.ts";
import {AdminGetColorAPI, AdminGetLinkAPI, AdminGetLocationAPI, VerifyLinkAPI} from "../../apis/api_link.ts";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import noAvatar from "../../assets/images/no_avatar.png";
import {ColorFilter, LocalTwo, Reject, Success} from "@icon-park/react";
import {animated, useSprings} from "@react-spring/web";
import {LocationGetAdminEntity} from "../../models/entity/location_get_admin_entity.ts";
import {ColorsEntity} from "../../models/entity/color_get_entity.ts";
import {InfoLabel} from "../../components/info_label.tsx";
import {LinkVerify} from "../../models/dto/link_verify.ts";

export function AdminLinkVerify({headerEmit, menuEmit}: Readonly<{
    headerEmit: (data: string) => void,
    menuEmit: (data: string) => void
}>) {
    const dispatch = useDispatch();

    const webInfoStore = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);
    const [adminLinkList, setAdminLinkList] = useState<LinkDO[]>([] as LinkDO[]);
    const [getLocation, setGetLocation] = useState<LocationGetAdminEntity>({} as LocationGetAdminEntity);
    const [getColor, setGetColor] = useState<ColorsEntity>({} as ColorsEntity);
    const [update, setUpdate] = useState<boolean>(true);

    const [springs] = useSprings(adminLinkList?.length || 0, (index) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(20px)"},
        delay: index * 25,
        config: {tension: 170, friction: 26},
    }));

    document.title = `友链审核 | ${webInfoStore.site.site_name}`;

    useEffect(() => {
        headerEmit("友链审核");
        menuEmit("link");
    }, [headerEmit, menuEmit]);

    useEffect(() => {
        const func = async () => {
            const getResp = await AdminGetLinkAPI();
            if (getResp?.output === "Success") {
                setAdminLinkList(getResp.data!.links.filter((link) => link.location === 0));
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error"
                } as ToastStore));
            }
        }
        if (update) {
            func().then();
        }
        setUpdate(false);
    }, [dispatch, update]);

    useEffect(() => {
        const funcGetLocation = async () => {
            const getRes = await AdminGetLocationAPI();
            if (getRes?.output === "Success") {
                setGetLocation(getRes.data!);
            } else {
                dispatch(setToaster({
                    title: getRes?.message,
                    message: getRes?.error_message,
                    type: "error",
                }));
            }
        }
        const funcGetColor = async () => {
            const getRes = await AdminGetColorAPI();
            if (getRes?.output === "Success") {
                setGetColor(getRes.data!);
            } else {
                dispatch(setToaster({
                    title: getRes?.message,
                    message: getRes?.error_message,
                    type: "error",
                }));
            }
        }
        funcGetLocation().then();
        funcGetColor().then();
    }, [dispatch]);

    useEffect(() => {
        console.log(adminLinkList);
        setUpdate(true);
    }, [adminLinkList]);

    async function handleLinkVerify(index: number, status: boolean) {
        const resultData = {
            desired_location: adminLinkList[index].desired_location,
            desired_color: adminLinkList[index].desired_color,
            id: adminLinkList[index].id,
            status: status
        } as LinkVerify;
        const getResp = await VerifyLinkAPI(resultData);
        if (getResp?.output === "Success") {
            dispatch(setToaster({
                title: "操作成功",
                message: "友链已审核" + (status ? "通过" : "拒绝"),
                type: "success"
            } as ToastStore));
            setAdminLinkList(adminLinkList.filter((_, i) => i !== index));
        } else {
            dispatch(setToaster({
                title: getResp?.message,
                message: getResp?.error_message,
                type: "error"
            } as ToastStore));
        }
    }

    return (
        <div>
            <div className={"grid grid-cols-1 lg:grid-cols-2 gap-3"}>
                {adminLinkList && adminLinkList.length > 0 ? (
                    adminLinkList.map((data, index) => (
                        <animated.div style={{
                            ...springs[index],
                            border: 2,
                            borderStyle: "solid",
                            borderColor: `#${getColor.colors[adminLinkList[index].desired_color].color}`
                        }} key={data.id}
                                      className={"card w-full bg-base-100 hover:bg-base-200 transition card-md shadow-sm"}>
                            <div className="card-body grid gap-1">
                                <div className={"flex items-start"}>
                                    <div className={"flex items-center space-x-2"}>
                                        <img
                                            className="rounded-md size-24"
                                            src={data.site_logo}
                                            alt={data.id.toString()}
                                            onError={(e) => {
                                                e.currentTarget.src = noAvatar;
                                                e.currentTarget.onerror = null;
                                            }}
                                        />
                                        <div className={"flex flex-col"}>
                                            <div className={"flex space-x-1 text-2xl font-bold"}>
                                                <a href={data.site_url} rel={"noreferrer noopener"}
                                                   target={"_blank"}
                                                   className={"transition link-primary line-clamp-1"}>{data.site_name}</a>
                                            </div>
                                            <div className={"flex space-x-1"}>
                                                <span className={"font-bold"}>站长邮箱：</span>
                                                <a href={`mailto:${data.webmaster_email}`}
                                                   rel={"noreferrer noopener"}
                                                   className={"transition line-clamp-1 hover:text-secondary text-base-content"}>
                                                    {data.webmaster_email}
                                                </a>
                                            </div>
                                            <div className={"flex space-x-1"}>
                                                <span className={"font-bold"}>服务提供：</span>
                                                <span className={"text-base-content"}>{data.service_provider}</span>
                                            </div>
                                            <div className={"flex space-x-1"}>
                                                <span className={"font-bold"}>申请时间：</span>
                                                <span className={"text-base-content"}>{data.created_at}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"grid gap-1 pt-3 grid-cols-2"}>
                                    <div className={"flex space-x-1 col-span-full"}>
                                        <span className={"font-bold"}>站点描述：</span>
                                        <span className={"text-base-content"}>{data.site_description}</span>
                                    </div>
                                    <div className={"flex space-x-1 col-span-full"}>
                                        <span className={"font-bold"}>订阅地址：</span>
                                        <a href={data.site_rss_url} target={"_blank"}
                                           className={"hover:text-secondary text-base-content"}>{data.site_rss_url}</a>
                                    </div>
                                    <div className={"flex space-x-1 col-span-full"}>
                                        <span className={"font-bold"}>备注信息：</span>
                                        <span className={"text-base-content"}>{data.remark}</span>
                                    </div>
                                    <div className={"flex space-x-1"}>
                                        <span className={"font-bold"}>申请时间：</span>
                                        <span className={"text-base-content"}>{data.created_at}</span>
                                    </div>
                                    <div className={"flex space-x-1"}>
                                        <span className={"font-bold"}>当前状态：</span>
                                        <span className={"text-base-content"}>待审核</span>
                                    </div>
                                    <div className={"flex space-x-1 col-span-full"}>
                                        <div className={"flex-1"}>
                                            <label className="select validator w-full">
                                                <div className="label">
                                                    <span>展示位置</span>
                                                    <span className={"text-xs text-red-500"}>*</span>
                                                </div>
                                                <select
                                                    required
                                                    value={data?.desired_location === 0 ? "" : data.desired_location}
                                                    onChange={(event) => {
                                                        const getAdminLinkList = [...adminLinkList];
                                                        getAdminLinkList[index].desired_location = Number(event.target.value);
                                                        setAdminLinkList(getAdminLinkList);
                                                    }}
                                                >
                                                    <option value="">请选择位置</option>
                                                    {getLocation.locations?.map((location, index) => (
                                                        <option key={"location-" + index} value={location.id}>
                                                            {location.display_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InfoLabel
                                                    data={
                                                        <div className={"grid"}>
                                                            <span>选择展示位置</span>
                                                        </div>
                                                    }
                                                    icon={<LocalTwo theme="outline" size="18" fill="#000000"/>}
                                                />
                                            </label>
                                            <p className="validator-hint hidden">
                                                请选择展示位置
                                            </p>
                                        </div>
                                        <div className={"flex-1"}>
                                            <label className="select validator w-full">
                                                <div className="label">
                                                    <span>展示颜色</span>
                                                    <span className={"text-xs text-red-500"}>*</span>
                                                </div>
                                                <select
                                                    required
                                                    value={data?.desired_color === 0 ? "" : data.desired_color}
                                                    onChange={(event) => {
                                                        const getAdminLinkList = [...adminLinkList];
                                                        getAdminLinkList[index].desired_color = Number(event.target.value);
                                                        setAdminLinkList(getAdminLinkList);
                                                    }}
                                                >
                                                    <option value="">请选择颜色</option>
                                                    {getColor.colors?.map((color, index) => (
                                                        <option key={"color-" + index} value={color.id}>
                                                            {color.display_name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InfoLabel
                                                    data={
                                                        <div className={"grid"}>
                                                            <span>选择边框强调色</span>
                                                        </div>
                                                    }
                                                    icon={<ColorFilter theme="outline" size="18" fill="#000000"/>}
                                                />
                                            </label>
                                            <p className="validator-hint hidden">
                                                请选择展示颜色
                                            </p>
                                        </div>
                                    </div>
                                    <div className={"flex space-x-1 col-span-full justify-end pt-3"}>
                                        <button className={"btn btn-warning flex space-x-1"}
                                                onClick={() => handleLinkVerify(index, false)}>
                                            <Reject theme="outline" size="20"/>
                                            <span>拒绝</span>
                                        </button>
                                        <button className={"btn btn-primary flex space-x-1"}
                                                onClick={() => handleLinkVerify(index, true)}>
                                            <Success theme="outline" size="20"/>
                                            <span>同意</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-4 text-gray-500">
                        暂时没有待审核的友链
                    </div>
                )}
            </div>
        </div>
    );
}
