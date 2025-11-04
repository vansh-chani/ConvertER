import { getRelativeTime, getDate } from "@/lib/date_utils";
import { apiRequest } from "@/lib/utils";

export default function ProjectCardLarge({ project_id, title, group, created_by, created_at, last_modified_at }: {
    project_id: string,
    title: string,
    group: string,
    created_by: string,
    created_at: string,
    last_modified_at: string,
}) {
    const lastModified = getRelativeTime(last_modified_at);
    const createdOn = getDate(created_at);
    const profileImage = "https://res.cloudinary.com/dx4rxpukt/image/upload/v1762150785/Ellipse_7_ths3ev.svg"; // Placeholder value
    return (
        <div className="border-b-[0.5px] border-[#a1a1a1] p-4 py-20 pl-12 w-full flex flex-col gap-3">
            <h2 className="font-bold text-[20px] text-black ">{title}</h2>
            <div className="flex flex-row gap-2 items-center">
                <p className='font-instrument-sans w-fit font-semibold text-[11px] text-[#2d2d2d] mt-1 bg-[#D9D9D9] rounded-full px-3 py-1'>{group}</p>
                <p className='font-jetbrains-mono w-fit font-semibold text-[10px] text-[#686868] mt-1'>Last Modified {lastModified}</p>
            </div>
            <p className='font-instrument-sans font-medium text-[16px] text-black'>Created on: <span className='font-medium font-jetbrains-mono text-[#686868] text-[14px] ml-2'>{createdOn}</span></p>
            <p className='font-instrument-sans font-medium text-[16px] text-black'>
                Author:
                <img src={profileImage} alt="Profile" className='w-[16px] inline-block rounded-full ml-2' />
                <span className='font-medium font-jetbrains-mono text-[#686868] text-[14px] ml-2'>{created_by}</span>
            </p>
            <div className="flex flex-row">
                <button className='mr-4 bg-[#333333] text-white cursor-pointer font-instrument-sans text-sm font-bold py-2 px-10 rounded-[6px] border border-[#333333] hover:opacity-80'
                    onClick={() => { window.location.href = `/project/${project_id}` }}
                >
                    Open
                </button>
                <button
                    className='bg-white text-[#333333] cursor-pointer font-instrument-sans text-sm font-bold py-2 px-10 rounded-[6px] border border-[#333333] hover:bg-[#33333320]'
                    onClick={async () => {
                        try {
                            await apiRequest(`/project/delete_project/${project_id}`, {
                                method: 'DELETE',
                            });
                            window.location.reload();
                        } catch (error) {
                            console.error('Error deleting project:', error);
                        }
                    }}
                >
                    Delete
                </button>

            </div>
        </div>
    );
}