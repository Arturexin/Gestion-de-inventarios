export const listaBlog = [
    {id: 1, titulo: 'Blog 1', contenido: 'Contenido del blog 1'},
    {id: 2, titulo: 'Blog 2', contenido: 'Contenido del blog 2'},
    {id: 3, titulo: 'Blog 3', contenido: 'Contenido del blog 3'},
    {id: 4, titulo: 'Blog 4', contenido: 'Contenido del blog 4'},
    {id: 5, titulo: 'Blog 5', contenido: 'Contenido del blog 5'}
]

export const getBlogById = (id) => {
    return listaBlog.find(x => x.id == id)
}