export function fakeapiUfs(){
    return new Promise<any>((resolve,reject)=> {
        setTimeout(()=> {
            resolve([
                {
                    id: 1,
                    sigla: "GO",
                    nome: "Goias",
                },
                {
                    id: 2,
                    sigla: "PR",
                    nome: "Parana"
                },
                {
                    id: 3,
                    sigla: "SP",
                    nome: "São Paulo"
                }
             ])
        },1000);
    })
}

export function fakeapiCities(){
    return new Promise<any>((resolve,reject)=> {
        setTimeout(()=> {
            resolve([
                {
                    id: 1,
                    nome: "Caldas Novas",
                },
                {
                    id: 2,
                    nome: "Goiania"
                },
                {
                    id: 3,
                    nome: "Anapolis"
                }
             ])
        },1000);
    })
}