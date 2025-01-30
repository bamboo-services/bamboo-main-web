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

import {animated, useSprings} from "@react-spring/web";
import {useEffect, useState} from "react";
import {AddLinkUserAPI, GetAbleSelectColorAPI, GetAbleSelectLocationAPI} from "../../apis/api_link.ts";
import {ColorAbleSelectEntity} from "../../models/entity/color_able_select_entity.ts";
import {useDispatch} from "react-redux";
import {setToaster} from "../../stores/toaster_store.ts";
import {ToastStore} from "../../models/store/toast_stores.ts";
import {LinkDisplayModule} from "../../models/modules/link_display_module.ts";
import {LinkAddDTO} from "../../models/dto/link_add.ts";
import {InfoLabel} from "../../components/info_label.tsx";
import {
    ColorFilter,
    Editor,
    Home,
    Info,
    Link,
    LocalTwo,
    Mail,
    NetworkDrive,
    Pic,
    Rss,
    Telegram
} from "@icon-park/react";
import {LocationAbleSelectEntity} from "../../models/entity/location_able_select_entity.ts";

export function OperateAddFriends({emitLinkDisplay}: Readonly<{
    emitLinkDisplay: (data: LinkDisplayModule) => void
}>) {
    const dispatch = useDispatch();

    const [getColor, setGetColor] = useState<ColorAbleSelectEntity>({} as ColorAbleSelectEntity);
    const [getLocation, setGetLocation] = useState<LocationAbleSelectEntity>({} as LocationAbleSelectEntity);
    const [linkAdd, setLinkAdd] = useState<LinkAddDTO>({} as LinkAddDTO);
    const [changeAdd, setChangeAdd] = useState<boolean>(false);
    const [changAddSpring, setChangAddSpring] = useState<boolean>(false);

    useEffect(() => {
        const funcAbleSelectColor = async () => {
            const getResp = await GetAbleSelectColorAPI();
            if (getResp?.output === "Success") {
                setGetColor(getResp.data!);
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error",
                } as ToastStore));
            }
        }
        const funcAbleSelectLocation = async () => {
            const getResp = await GetAbleSelectLocationAPI();
            if (getResp?.output === "Success") {
                setGetLocation(getResp.data!);
            } else {
                dispatch(setToaster({
                    title: getResp?.message,
                    message: getResp?.error_message,
                    type: "error",
                } as ToastStore));
            }
        }
        funcAbleSelectColor().then();
        funcAbleSelectLocation().then();
    }, [dispatch]);

    useEffect(() => {
        emitLinkDisplay({
            site_logo: linkAdd.site_logo,
            site_name: linkAdd.site_name,
            site_description: linkAdd.site_description,
        } as LinkDisplayModule);
    }, [emitLinkDisplay, linkAdd.site_description, linkAdd.site_logo, linkAdd.site_name]);

    const [setupSprings] = useSprings(3, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(10px)"},
        delay: index * 100 + 150,
        config: {tension: 100, friction: 26},
    }));

    const [springs] = useSprings(changAddSpring ? 13 : 0, (index: number) => ({
        opacity: 1,
        transform: "translateY(0)",
        from: {opacity: 0, transform: "translateY(10px)"},
        delay: index * 50,
        config: {tension: 100, friction: 26},
    }));

    function clickToChangeAdd() {
        setChangeAdd(!changeAdd);
        setTimeout(() => {
            setChangAddSpring(!changAddSpring);
        });
    }

    async function submitLinkAdd() {
        const getResp = await AddLinkUserAPI(linkAdd);
        if (getResp?.output === "Success") {
            dispatch(setToaster({
                title: "友链申请成功",
                message: getResp?.message,
                type: "success",
            } as ToastStore));
            setLinkAdd({} as LinkAddDTO);
            setChangeAdd(false);
            setTimeout(() => {
                setChangAddSpring(false);
            });
        } else {
            dispatch(setToaster({
                title: getResp?.message,
                message: getResp?.error_message,
                type: "error",
            } as ToastStore));
        }
    }

    return (
        <div className={"grid grid-cols-2 gap-3"}>
            {changeAdd ? (
                <>
                    <div className={"col-span-full flex text-2xl font-bold justify-center"}>
                        友链申请
                    </div>

                    <animated.div style={springs[0]} className={"grid"}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站长邮箱</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="email"
                                placeholder="gm@x-lf.cn"
                                pattern="^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"
                                title="邮箱格式不正确"
                                onChange={(e) => setLinkAdd({...linkAdd, webmaster_email: e.target.value})}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>邮箱是为您发送友链审核通过的通知，不会被公开。</span>
                                        <span>并且填写邮箱后续有需要修改友链信息，可直接验证邮箱验证码即可修改站点。</span>
                                    </div>
                                }
                                icon={<Mail theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            邮箱格式不正确
                        </p>
                    </animated.div>

                    <animated.div style={springs[1]} className={"grid"}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>服务提供</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="阿里云"
                                onChange={(e) => setLinkAdd({...linkAdd, service_provider: e.target.value})}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>为了保证站点的质量，推荐使用大厂服务商</span>
                                        <span>博主只是想看看朋友你会不会想用心经营下去这个站点</span>
                                        <span className="text-gray-500">（不影响友链审核，也不会公开）</span>
                                    </div>
                                }
                                icon={<NetworkDrive theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入服务提供商
                        </p>
                    </animated.div>

                    <animated.div style={springs[2]} className={"grid"}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站点名字</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="凌中的锋雨"
                                title="请输入站点名称"
                                onChange={(e) => setLinkAdd({...linkAdd, site_name: e.target.value})}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>您的站点名字，例如：</span>
                                        <b className="text-primary">凌中的锋雨</b>
                                    </div>
                                }
                                icon={<Home theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入站点名称
                        </p>
                    </animated.div>

                    <animated.div style={springs[3]} className={"grid"}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站点地址</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://www.x-lf.com/"
                                pattern="^(http|https)://[^\s]*$"
                                title="请输入有效的URL地址"
                                onChange={(e) => setLinkAdd({...linkAdd, site_url: e.target.value})}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>您的站点地址（需包含http/https协议头）：</span>
                                        <a href={"https://www.x-lf.com/"}
                                           className="text-primary hover:underline"
                                           target="_blank"
                                           rel="noreferrer">
                                            https://www.x-lf.com/
                                        </a>
                                    </div>
                                }
                                icon={<Link theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入有效的URL地址
                        </p>
                    </animated.div>

                    <animated.div style={springs[4]} className={"grid col-span-full"}>
                        <label className="input validator transition w-full">
                            <div className="label">
                                <span>站点图片</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://www.x-lf.com/"
                                pattern="^(http|https)://[^\s]+.(jpg|jpeg|webp|png|ico)$"
                                title="请输入有效的URL地址"
                                onChange={(e) => setLinkAdd({...linkAdd, site_logo: e.target.value})}
                                required
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>图片地址支持 PNG/JPG/JPEG/WEBP/ICO 格式</span>
                                        <span>推荐尺寸：256×256 像素</span>
                                    </div>
                                }
                                icon={<Pic theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入有效的图片地址
                            <br/>图片地址支持 PNG/JPG/JPEG/WEBP/ICO 格式
                        </p>
                    </animated.div>

                    <animated.div style={springs[5]} className={"grid col-span-full"}>
                        <label className="input transition w-full">
                            <div className="label">
                                <span>订阅地址</span>
                                <span className={"text-xs text-red-500 opacity-0"}>*</span>
                            </div>
                            <input
                                type="url"
                                placeholder="https://www.x-lf.com/atom.xml"
                                pattern="^(http|https)://[^\s]*$"
                                title="请输入有效的站点订阅地址"
                                onChange={(e) => setLinkAdd({...linkAdd, site_rss_url: e.target.value})}
                            />
                            <InfoLabel
                                clazz={"label"}
                                data={
                                    <div className={"grid"}>
                                        <span>Rss/Atom订阅地址（可选）</span>
                                        <a href={"https://blog.x-lf.com/atom.xml"}
                                           className="text-primary hover:underline"
                                           target="_blank"
                                           rel="noreferrer">
                                            https://blog.x-lf.com/atom.xml
                                        </a>
                                    </div>
                                }
                                icon={<Rss theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                    </animated.div>

                    <animated.div style={springs[6]} className={"grid col-span-full"}>
                        <label className="textarea validator w-full">
                            <div className={"flex items-center space-x-1"}>
                                <InfoLabel
                                    data={
                                        <div className={"grid"}>
                                            <span>用一句话描述您的站点：</span>
                                            <b className="text-primary">不为如何，只为在茫茫人海中有自己的一片天空~</b>
                                        </div>
                                    }
                                    icon={<Editor theme="outline" size="18" fill="#000000"/>}
                                />
                                <div className="label">
                                    <span>站点描述</span>
                                    <span className={"text-xs text-red-500"}>*</span>
                                </div>
                            </div>
                            <textarea
                                placeholder="不为如何，只为在茫茫人海中有自己的一片天空"
                                className="w-full textarea"
                                required
                                onChange={(e) => setLinkAdd({...linkAdd, site_description: e.target.value})}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请输入站点描述
                        </p>
                    </animated.div>

                    <animated.div style={springs[7]} className={"col-span-full pt-3"}>
                        <div className="divider before:bg-gray-200 after:bg-gray-200 text-gray-500">站点属性</div>
                    </animated.div>

                    <animated.div style={springs[8]} className={"grid"}>
                        <label className="select validator w-full">
                            <div className="label">
                                <span>展示位置</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <select
                                required
                                onChange={(e) => setLinkAdd({...linkAdd, desired_location: Number(e.target.value)})}
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
                                        <span>选择您的展示位置</span>
                                        <span>注意：展示位置为您的预期，博主会根据您的选择与您站点内容性质进行选择展示位置</span>
                                        <span className="text-gray-500">（不可选位置为保留位置）</span>
                                    </div>
                                }
                                icon={<LocalTwo theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请选择展示位置
                        </p>
                    </animated.div>

                    <animated.div style={springs[9]} className={"grid"}>
                        <label className="select validator w-full">
                            <div className="label">
                                <span>展示颜色</span>
                                <span className={"text-xs text-red-500"}>*</span>
                            </div>
                            <select
                                required
                                onChange={(e) => setLinkAdd({...linkAdd, desired_color: Number(e.target.value)})}
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
                                        <span>注意：某些颜色为特定颜色，不可选择</span>
                                        <span className="text-gray-500">（不可选颜色为保留）</span>
                                    </div>
                                }
                                icon={<ColorFilter theme="outline" size="18" fill="#000000"/>}
                            />
                        </label>
                        <p className="validator-hint hidden">
                            请选择展示颜色
                        </p>
                    </animated.div>

                    <animated.div style={springs[10]} className={"col-span-full pt-3"}>
                        <div className="divider before:bg-gray-200 after:bg-gray-200 text-gray-500">备注信息</div>
                    </animated.div>

                    <animated.div style={springs[11]} className={"grid col-span-full"}>
                        <label className="textarea w-full">
                            <div className={"flex items-center space-x-1"}>
                                <InfoLabel
                                    data={
                                        <div className={"grid"}>
                                            <span>给站长的留言（可选）：</span>
                                            <span className="text-gray-500">（仅站长可见）</span>
                                        </div>
                                    }
                                    icon={<Telegram theme="outline" size="18" fill="#000000"/>}
                                />
                                <div className="label">
                                    <span>备注留言</span>
                                    <span className={"text-xs text-red-500 opacity-0"}>*</span>
                                </div>
                            </div>
                            <textarea
                                placeholder="对我说的一些备注内容"
                                className="w-full textarea"
                                onChange={(e) => setLinkAdd({...linkAdd, remark: e.target.value})}
                            />
                        </label>
                    </animated.div>

                    <animated.div style={springs[12]} className={"grid col-span-full w-full justify-center mt-6"}>
                        <button className="btn btn-outline btn-primary"
                                onClick={submitLinkAdd}>
                            提交申请
                        </button>
                    </animated.div>
                </>
            ) : (
                <>
                    <div className={"col-span-full flex text-2xl font-bold justify-center"}>
                        友链申请
                    </div>

                    <animated.div style={setupSprings[0]} role="alert"
                                  className="alert alert-info alert-soft col-span-full">
                        <Info theme="outline" size="18" className={"text-info"}/>
                        <div className={"grid"}>
                            <span>友链申请是一个简单的过程，只需要填写几个简单的信息即可。</span>
                            <span>友链审核通过后，会在友链页面展示您的站点信息。</span>
                            <span>在添加友链之前，请先在您的站点添加博主友链，添加后再申请。</span>
                            <span>避免审核时，未看到友链，导致审核失败。</span>
                        </div>
                    </animated.div>

                    <animated.div style={setupSprings[1]} className="overflow-x-auto col-span-full">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>信息</th>
                                <th>值</th>
                                <th>备注</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="transition hover:bg-base-200">
                                <td className={"flex space-x-1 items-center"}>
                                    <Mail theme="outline" size="18" fill="#000000"/>
                                    <span>站长邮箱</span>
                                </td>
                                <td>gm@x-lf.cn</td>
                                <td>有需要可以直接联系</td>
                            </tr>
                            <tr className="transition hover:bg-base-200">
                                <td className={"flex space-x-1 items-center"}>
                                    <Home theme="outline" size="18" fill="#000000"/>
                                    <span>站点名字</span>
                                </td>
                                <td>凌中的锋雨</td>
                                <td></td>
                            </tr>
                            <tr className="transition hover:bg-base-200">
                                <td className={"flex space-x-1 items-center"}>
                                    <Editor theme="outline" size="18" fill="#000000"/>
                                    <span>站点描述</span>
                                </td>
                                <td>不为如何，只为在茫茫人海中有自己的一片天空~</td>
                                <td></td>
                            </tr>
                            <tr className="transition hover:bg-base-200">
                                <td className={"flex space-x-1 items-center"}>
                                    <Link theme="outline" size="18" fill="#000000"/>
                                    <span>站点地址</span>
                                </td>
                                <td>
                                    <a href="https://www.x-lf.com" className={"transition link-primary"}
                                       target={"_blank"}>
                                        https://www.x-lf.com
                                    </a>
                                </td>
                                <td></td>
                            </tr>
                            <tr className="transition hover:bg-base-200">
                                <td className={"flex space-x-1 items-center"}>
                                    <Pic theme="outline" size="18" fill="#000000"/>
                                    <span>站点图片</span>
                                </td>
                                <td>
                                    <a href="https://i-cdn.akass.cn/2024/05/664870a814c0d.png!wp"
                                       className={"transition link-primary"}
                                       target={"_blank"}>
                                        https://i-cdn.akass.cn/2024/05/664870a814c0d.png!wp
                                    </a>
                                </td>
                                <td></td>
                            </tr>
                            <tr className="transition hover:bg-base-200">
                                <td className={"flex space-x-1 items-center"}>
                                    <Rss theme="outline" size="18" fill="#000000"/>
                                    <span>站点订阅</span>
                                </td>
                                <td>
                                    <a href="https://blog.x-lf.com/atom.xml"
                                       className={"transition link-primary"}
                                       target={"_blank"}>
                                        https://blog.x-lf.com/atom.xml
                                    </a>
                                </td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </animated.div>

                    <animated.div style={setupSprings[2]} className={"grid col-span-full"}>
                        <div className={"flex justify-center"}>
                            <button className="btn btn-soft btn-primary"
                                    onClick={clickToChangeAdd}>
                                我已了解，添加(*^▽^*)
                            </button>
                        </div>
                    </animated.div>
                </>
            )}
        </div>
    );
}
