import  { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Animal from 'App/Models/Animal'

export default class AnimalsController {

  public async getListarAnimales(): Promise<Animal[]> {
    const animales = await Animal.all()
    return animales;
  }

  public async getAnimalEspecies({request}: HttpContextContract)  {
    const especie = request.param('especie');
    const animal = await Animal.query().where('especie', especie);
    return animal;
  }

  public async getAnimalMenosDeOchoAnios(): Promise<Animal[]> {
    const animales = await Animal.query().where('edad', '<', 8);
    return animales;
  }

  public async updateAnimal({request, response}: HttpContextContract) {
    const dataAnimal = request.only(['codigo_animal','nombre_animal', 'especie', 'raza', 'genero', 'edad'])
    try{
      const codigoAnimal = dataAnimal.codigo_animal;
      const animalExiste: Number = await this.getValidarExisteAnimal(codigoAnimal);
      if(animalExiste == 1){
        await Animal.query().where('codigo_animal', codigoAnimal).update(dataAnimal);
        response.status(200).json({message: 'Animal actualizado correctamente'});
      }
      else{
        response.status(400).json({message: 'El animal no existe'});
      }
    }catch(error){
      response.status(500).json({message: 'Error al actualizar animal'});
    }
  }

  public async deleteAnimal({request, response}: HttpContextContract) {
    const dataAnimal = request.param('id');
    try{
      const codigoAnimal = dataAnimal;
      const animalExiste: Number = await this.getValidarExisteAnimal(codigoAnimal);
      if(animalExiste == 1){
        await Animal.query().where('codigo_animal', codigoAnimal).delete();
        response.status(200).json({message: 'Animal eliminado correctamente'});
      }
      else{
        response.status(400).json({message: 'El animal no existe'});
      }
    }catch(error){
      console.log(error);

      response.status(500).json({message: 'Error al eliminar animal'});
    }
  }

  public async setRegistrarAnimal({request, response}: HttpContextContract) {
    const dataAnimal = request.only(['codigo_animal','nombre_animal', 'especie', 'raza', 'genero', 'edad'])
    try{
      const codigoAnimal = dataAnimal.codigo_animal;
      const animalExiste: Number = await this.getValidarExisteAnimal(codigoAnimal);
      if(animalExiste == 0){
        await Animal.create(dataAnimal);
        response.status(200).json({message: 'Animal registrado correctamente'});
      }
      else{
        response.status(400).json({message: 'El animal ya existe'});
      }
    }catch(error){
      response.status(500).json({message: 'Error al registrar animal'});
    }
  }

  public async getValidarExisteAnimal(codigoAnimal: number): Promise<Number> {
    const total = await Animal.query().where('codigo_animal', codigoAnimal).count('* as cantidad').from('animals');
    return total[0].cantidad;
  }


}
