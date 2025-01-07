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
import {ToastStore} from "../../models/store/toast_stores.ts";
import {SystemInfoEntity} from "../../models/entity/system_info_entity.ts";
import {Link, useNavigate} from "react-router";
import {Button, Checkbox, Input, Label} from "@fluentui/react-components";
import {KeyRegular, PersonRegular, SendRegular} from "@fluentui/react-icons";
import {useState} from "react";
import {AuthLoginDTO} from "../../models/dto/auth_login.ts";
import {UserLoginAPI} from "../../apis/api_auth.ts";
import {setToaster} from "../../stores/toaster_store.ts";

import favIcon from "../../assets/images/favicon.png";
import authBackground from "../../assets/images/auth_background.jpg";

export function AuthLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const webInfoState = useSelector((state: { webInfo: SystemInfoEntity }) => state.webInfo);

    const [authLogin, setAuthLogin] = useState({remember: false} as AuthLoginDTO);

    async function userLogin() {
        const getResp = await UserLoginAPI(authLogin);
        if (getResp?.output === "Success") {
            dispatch(setToaster({
                title: `欢迎回来`,
                message: `${getResp.data?.user.username}！`,
                type: "success",
            } as ToastStore));
            localStorage.setItem("UserToken", getResp.data!.token);
            setTimeout(() => {
                navigate("/admin/dashboard");
            }, 500);
        } else {
            dispatch(setToaster({
                title: getResp?.message,
                message: getResp?.error_message,
                type: "error",
            } as ToastStore));
        }
    }

    document.title = `${webInfoState.site.site_name} | 用户登录`;

    return (
        <section className="bg-white">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="Background"
                        src={authBackground}
                        className="absolute inset-0 h-full w-full object-cover opacity-80"
                    />
                    <div className="hidden lg:relative lg:block lg:p-12">
                        <div className={"flex"}>
                            <Link to="/">
                                <img src={favIcon} alt="UserAvatar" className="rounded-3xl h-32 w-32 shadow-lg"/>
                            </Link>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            {webInfoState.site.site_name}
                        </h2>

                        <p className="mt-4 leading-relaxed text-white/90">
                            {webInfoState.blogger.description}
                        </p>
                    </div>
                </section>

                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                >
                    <div className="max-w-xl lg:max-w-3xl">
                        <div className="relative -mt-16 block lg:hidden">
                            <Link to={"/"}
                                  className="inline-flex items-center justify-center rounded-full bg-white text-blue-600 sm:size-20">
                                <img src={favIcon} alt="UserAvatar" className="rounded-3xl h-8 sm:h-10" draggable={false}/>
                            </Link>
                            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                                {webInfoState.site.site_name}
                            </h1>
                            <p className="mt-4 leading-relaxed text-gray-500">
                                {webInfoState.blogger.description}
                            </p>
                        </div>

                        <form className="mt-8 grid gap-3" onSubmit={(e) => { e.preventDefault(); userLogin().then(); }}>
                            <div className={"grid justify-center mb-9"}>
                                <h2 className={"text-4xl font-bold text-center"}>用户登录</h2>
                            </div>
                            <div className={"grid space-y-0.5 w-full"}>
                                <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                                    <span>用户名</span>
                                    <span className={"text-xs text-red-500"}>*</span>
                                </Label>
                                <Input
                                    className={"w-96"}
                                    size={"large"}
                                    contentBefore={<PersonRegular/>}
                                    onChange={(e) => setAuthLogin({...authLogin, user: e.target.value})}
                                />
                            </div>
                            <div className={"grid space-y-0.5 w-full"}>
                                <Label htmlFor={"user"} className={"flex space-x-0.5"}>
                                    <span>密码</span>
                                    <span className={"text-xs text-red-500"}>*</span>
                                </Label>
                                <Input
                                    type={"password"}
                                    className={"w-96"}
                                    size={"large"}
                                    contentBefore={<KeyRegular/>}
                                    onChange={(e) => setAuthLogin({...authLogin, pass: e.target.value})}
                                />
                            </div>
                            <div className={"grid space-y-0.5"}>
                                <Checkbox size="large" label="记住登录"
                                          onChange={(e) => setAuthLogin({...authLogin, remember: e.target.checked})}/>
                            </div>
                            <div className={"grid w-full justify-center mt-3"}>
                                <Button type={"submit"} appearance="primary" size={"large"} color={"red"}
                                        icon={<SendRegular/>}>
                                    登录
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </section>
    );
}
