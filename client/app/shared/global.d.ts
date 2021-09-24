type AppChronos = string;
type AppColor = string;
type AppEmail = string;
type AppLogin = string;
type AppUpload = File;
type AppUrl = string;

// All IDs
// Ideally we should not use `any` at all, but we want to be able
// to use either a string or an entire subobject.
type AppAntiqueNameID = string | any;
type AppArtistID = string | any;
type AppCardID = string | any;
type AppChangeID = string | any;
type AppCollectionID = string | any;
type AppCountryID = string | any;
type AppDocumentTypeID = string | any;
type AppDomainID = string | any;
type AppExportID = string | any;
type AppFileID = string | any;
type AppInstitutionID = string | any;
type AppLogID = string | any;
type AppMaterialID = string | any;
type AppNewsID = string | any;
type AppPeriodID = string | any;
type AppStatisticID = string | any;
type AppTagID = string | any;
type AppUserID = string | any;
