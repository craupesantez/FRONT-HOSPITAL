<template>
    <div>
        <h1>Foto desde componente:{{ $route.query.token }}</h1>
    </div>
</template>
<script>
    export default {
        name: 'Recuperar',
    }
</script>