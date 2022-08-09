import { Body, Controller, Post, Put } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    @Post()
    public async list() {
        return this.menuService.getMenuList();
    }

    @Put()
    public async create(@Body() createMenuDto: CreateMenuDto) {
        return await this.menuService.createMenu(createMenuDto);
    }
}
