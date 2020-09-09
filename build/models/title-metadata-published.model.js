"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TitleMetadataPublished = void 0;
const typeorm_1 = require("typeorm");
const environment_settings_1 = require("../settings/environment.settings");
let TitleMetadataPublished = class TitleMetadataPublished {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], TitleMetadataPublished.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_id' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "titleId", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_name' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "titleName", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_summary', length: 4000 }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "titleSummary", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_type' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "titleType", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_active', type: 'tinyint' }),
    __metadata("design:type", Number)
], TitleMetadataPublished.prototype, "titleActive", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_url_image_portrait' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "titleUrlImagePortrait", void 0);
__decorate([
    typeorm_1.Column({ name: 'title_url_image_landscape' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "titleUrlImageLandscape", void 0);
__decorate([
    typeorm_1.Column({ name: 'brand_id' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "brandId", void 0);
__decorate([
    typeorm_1.Column({ name: 'asset_id' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "assetId", void 0);
__decorate([
    typeorm_1.Column({ name: 'asset_active', type: 'tinyint' }),
    __metadata("design:type", Number)
], TitleMetadataPublished.prototype, "assetActive", void 0);
__decorate([
    typeorm_1.Column({ name: 'asset_type' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "assetType", void 0);
__decorate([
    typeorm_1.Column({ name: 'asset_url_image_portrait' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "assetUrlImagePortrait", void 0);
__decorate([
    typeorm_1.Column({ name: 'asset_url_image_landscape' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "assetUrlImageLandscape", void 0);
__decorate([
    typeorm_1.Column({ name: 'episode_no', type: 'int' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "episodeNo", void 0);
__decorate([
    typeorm_1.Column({ name: 'season_no', type: 'int' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "seasonNo", void 0);
__decorate([
    typeorm_1.Column({ name: 'episode_summary', length: 4000 }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "episodeSummary", void 0);
__decorate([
    typeorm_1.Column({ length: 1000 }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "categories", void 0);
__decorate([
    typeorm_1.Column({ name: 'published_date', type: 'timestamp' }),
    __metadata("design:type", Object)
], TitleMetadataPublished.prototype, "publishedDate", void 0);
__decorate([
    typeorm_1.Column({ name: 'timestamp', type: 'timestamp' }),
    __metadata("design:type", String)
], TitleMetadataPublished.prototype, "timestamp", void 0);
TitleMetadataPublished = __decorate([
    typeorm_1.Entity({
        name: 'titles_metadata_published',
        database: environment_settings_1.AWS_DBASE,
        synchronize: false
    })
], TitleMetadataPublished);
exports.TitleMetadataPublished = TitleMetadataPublished;
