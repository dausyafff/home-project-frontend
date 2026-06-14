export default function ProjectCard({ project, onEdit, onDelete, isAdmin }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{project.title}</h3>
                {project.is_featured && (
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
                        Featured
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                {project.description}
            </p>

            {/* Tech Stack */}
            {project.tech_stack && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech) => (
                        <span key={tech}
                            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md">
                            {tech}
                        </span>
                    ))}
                </div>
            )}

            {/* Links */}
            <div className="flex items-center justify-between">
                <div className="flex gap-3">
                    {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer"
                            className="text-gray-500 hover:text-gray-800 text-sm transition-colors">
                            GitHub →
                        </a>
                    )}
                    {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer"
                            className="text-blue-500 hover:text-blue-700 text-sm transition-colors">
                            Live →
                        </a>
                    )}
                </div>

                {/* Admin Actions — hanya tampil kalau isAdmin */}
                {isAdmin && (
                    <div className="flex gap-2">
                        <button onClick={() => onEdit(project)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg transition-colors">
                            Edit
                        </button>
                        <button onClick={() => onDelete(project.id)}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-1 rounded-lg transition-colors">
                            Hapus
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}