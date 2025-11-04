"use client";
import { useEffect, useState } from 'react';
import logo from '@/assets/logo.svg';
import Image from 'next/image';
import { IoSearch } from "react-icons/io5";
import { apiRequest } from '@/lib/utils';
import Navbar from '@/components/ui/navbar';
import favicon from '@/assets/favicon_logo.svg';
import ProjectCardLarge from '@/components/projectCardLarge';

interface UserData {
    username: string;
}

interface LibraryData {
    groups: string[];
    pinned: any[];
}

interface ProjectData {
    project_id: string;
    title: string;
    group: string;
    created_by: string;
    created_at: string;
    last_modified_at: string;
}


export default function LibraryPage() {
    const [page, setPage] = useState("library");
    const [userData, setUserData] = useState<UserData | null>(null);
    const [libraryData, setLibraryData] = useState<LibraryData | null>(null);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [pinnedProjectsAvailable, setPinnedProjectsAvailable] = useState(false);

    const profile = "https://res.cloudinary.com/dx4rxpukt/image/upload/v1762150785/Ellipse_7_ths3ev.svg";
    const pinnedProjectDivHeight = pinnedProjectsAvailable ? 'auto' : '200px';

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const [userResponse, libraryResponse, projectsResponse] = await Promise.all([
                    apiRequest('/auth/users/me'),
                    apiRequest('/library/get_library'),
                    apiRequest('/library/get_projects')
                ]);

                setUserData(userResponse);
                setLibraryData(libraryResponse);
                setProjects(projectsResponse);

                if (libraryResponse.pinned && libraryResponse.pinned.length > 0) {
                    setPinnedProjectsAvailable(true);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const createProject = async () => {
        try {
            const response = await apiRequest('/project/create_project', {
                method: 'POST',
            });
            window.location.href = `/project/${response.project_id}`;
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Image src={favicon} alt="Logo" className="h-24 mb-4 animate-spin" />
            </div>
        );
    }

    return (
        <div
            className={`
        grid
        h-screen w-full
        grid-cols-1 grid-rows-[55px_55px_${pinnedProjectDivHeight}_55px_auto]
        bg-white
        md:grid-cols-[14%_72%_14%]
        `}
        >
            <div className="p-4"></div>
            <Navbar page={page} />
            <div className=" p-4 "></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4"></div>
            <div className="p-4 flex flex-row justify-between items-center">
                <div className="flex flex-row justify-start items-center gap-3">
                    <img src={profile} alt="" className='w-[30px]' />
                    <p className='font-instrument-sans font-semibold text-[#2d2d2d]'>{userData?.username}'s Projects</p>
                    <p className='font-instrument-sans w-fit font-semibold text-[10px] text-[#2d2d2d] mt-1 bg-[#D9D9D9] rounded-full px-3 py-1'>{libraryData?.groups[0]}</p>
                </div>
                <div className='flex flex-row items-center justify-center'>
                    <button className='mr-2 ml-auto text-[#333333] bg-white cursor-pointer font-instrument-sans text-sm font-bold py-2 px-4 rounded-full border border-[#333333] hover:bg-[#33333320]'>
                        Import Project
                    </button>
                    <button onClick={createProject} className='mr-6 ml-auto bg-[#333333] text-white cursor-pointer font-instrument-sans text-sm font-bold py-2 px-4 rounded-full border border-[#333333] hover:opacity-80'>
                        New Project
                    </button>
                    <div className='relative px-4 bg-[#EEEEEE] rounded-[6px] flex items-center ml-2'>
                        <IoSearch color='black' />
                        <input type="text" placeholder="Search Projects...." className='bg-transparent outline-none pl-2 pr-4 py-2 w-full font-medium text-sm text-black font-instrument-sans placeholder:text-black' />
                        <p className='absolute right-3 text-[10px] text-gray-500 font-instrument-sans font-bold bg-white p-1 rounded-[6px]'>Ctrl + K</p>
                    </div>
                </div>
            </div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4"></div>
            <div className="p-4 "></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] p-4 bg-gradient-to-r from-[#1E1E1E] via-[#505050] to-[#848484] pl-12">
                <h1 className='font-bold font-instrument-sans text-white text-[24px]'>Pinned Projects</h1>
                <div className="flex flex-row mt-2 justify-center items-center gap-2">
                    <p className='font-jetbrains-mono text-gray-300 text-[16px] mt-10'>No pinned projects yet!</p>
                </div>
            </div>
            <div className="p-4"></div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4"></div>
            <div className="p-4 pl-12 flex flex-row items-center justify-between">
                <h1 className='font-bold font-instrument-sans text-black text-[32px]'>Recents</h1>
            </div>
            <div className="outline-[0.5px] outline-[#a1a1a1] -outline-offset-1 p-4"></div>
            <div className=" p-4 "></div>
            <div className="outline-[0.5px] outline-[#a1a1a1]">
                <div className="w-full">
                    {projects.map((p: any) => (
                        <ProjectCardLarge
                            key={p.project_id}
                            project_id={p.project_id}
                            title={p.title}
                            group={p.group}
                            created_by={p.created_by}
                            created_at={p.created_at}
                            last_modified_at={p.last_modified_at}
                        />
                    ))}
                </div>
            </div>
        </div >
    );
}