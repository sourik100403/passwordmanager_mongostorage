import React, { useEffect } from "react";
import { useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);
    const getPasswords = async()=>{
        let req=await fetch("http://localhost:3000/")
        let passwords = await req.json();
            setPasswordArray(passwords);
            console.log(passwords)
    }

    useEffect(() => {
        getPasswords();
    }, []);

    // for showing and hiding the icons
    const showPassword = () => {
        passwordRef.current.type = passwordRef.current.type === "password" ? "text" : "password";
        ref.current.src = passwordRef.current.type === "password" ? "icons/eye.png" : "icons/eyecross.png";
    };

    // for saving password in local storage
    const savePassword = async() => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const updatedPasswords = [...passwordArray, { ...form, id: uuidv4() }];
            setPasswordArray(updatedPasswords);
            let res=await fetch("http://localhost:3000/",
                {
                    method:"post",
                    headers:{
                        "content-Type":"application/json"
                    },
                    body:JSON.stringify({...form,id:uuidv4()})
                }
            )
            // localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
            setForm({ site: "", username: "", password: "" });
            toast('Password Saved Successfully!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        } else {
            toast('Password Not Saved, length should be at least 3', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    };

    // for deleting password
    const deletePassword = async(id) => {
        let c = confirm("Do you really want to delete this password?");
        if (c) {
            const updatedPasswords = passwordArray.filter(item => item.id !== id);
            setPasswordArray(updatedPasswords);
            // localStorage.setItem("passwords", JSON.stringify(updatedPasswords));
            let res=await fetch("http://localhost:3000/",
                {
                    method:"DELETE",
                    headers:{
                        "content-Type":"application/json"
                    },
                    body:JSON.stringify({id})
                }
            )
            toast('Password Deleted Successfully!!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        } else {
            toast('Password Not Deleted', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light"
            });
        }
    };

    // for editing password
    const editPassword = (id) => {
        const passwordToEdit = passwordArray.find(item => item.id === id);
        setForm(passwordToEdit);
        deletePassword(id);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // for copying text to clipboard
    const copyText = (text) => {
        toast('Copied to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light"
        });
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            {/* for toast  */}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            {/* Same as */}
            <ToastContainer />
            {/* for background */}
            <div className="absolute top-0 -z-10 h-full w-full bg-green-50">
                <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
            </div>

            {/* design form page  */}
            <div className="p-2 md:mycontainer min-h-[88.2vh]">
                <h1 className="text-4xl font-bold text-center">
                    <span className='text-green-500'>/&lt;</span>
                    <span>Pass</span><span className='text-green-500'>OP /&gt;</span>
                </h1>
                <p className="text-green-900 text-center text-lg">Your Own Password Manager</p>

                <div className="flex flex-col p-4 text-black gap-8 items-center">
                    <input value={form.site} onChange={handleChange} placeholder="Enter Website URL" className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="site" id="site" />
                    <div className="flex flex-col md:flex-row w-full justify-between gap-8">
                        <input value={form.username} onChange={handleChange} placeholder="Enter User Name" className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name="username" id="username" />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder="Enter Password" className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name="password" id="password" />
                            <span className="absolute right-[3px] top-[4px] cursor-pointer" onClick={showPassword}>
                                <img ref={ref} className="p-1" width={26} src="icons/eye.png" alt="eye" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className="flex justify-center items-center bg-green-400 hover:bg-green-300 rounded-full px-8 gap-2 py-2 w-fit border-green-900 border">
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save
                    </button>
                </div>

                {/* this div for content showing */}
                <div className="passwords">
                    <h2 className="font-bold text-2xl py-4">Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No Password To Show</div>}
                    {passwordArray.length !== 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className="bg-green-800 text-white">
                            <tr>
                                <th className="py-2">Site</th>
                                <th className="py-2">Username</th>
                                <th className="py-2">Password</th>
                                <th className="py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-green-100">
                            {passwordArray.map((item, index) => (
                                <tr key={index}>
                                    <td className="py-2 border border-white text-center">
                                        <div className="flex items-center justify-center">
                                            <a href={item.site} target="_blank">{item.site}</a>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.site) }}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 border border-white text-center">
                                        <div className="flex items-center justify-center">
                                            <span>{item.username}</span>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.username) }}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2 border border-white text-center">
                                        <div className="flex items-center justify-center">
                                            <span>{"*".repeat(item.password.length)}</span>
                                            <div className="lordiconcopy size-7 cursor-pointer" onClick={() => { copyText(item.password) }}>
                                                <lord-icon
                                                    style={{ width: "25px", height: "25px", paddingTop: "3px", paddingLeft: "3px" }}
                                                    src="https://cdn.lordicon.com/iykgtsbt.json"
                                                    trigger="hover">
                                                </lord-icon>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="justify-center py-2 border border-white text-center">
                                        <span className="cursor-pointer mx-2" onClick={() => { editPassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/gwlusjdu.json"
                                                trigger="hover"
                                                style={{ width: "25px", height: "25px" }}>
                                            </lord-icon>
                                        </span>
                                        <span className="cursor-pointer mx-2" onClick={() => { deletePassword(item.id) }}>
                                            <lord-icon
                                                src="https://cdn.lordicon.com/skkahier.json"
                                                trigger="hover"
                                                style={{ width: "25px", height: "25px" }}>
                                            </lord-icon>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>}
                </div>
            </div>
        </>
    );
};

export default Manager;

